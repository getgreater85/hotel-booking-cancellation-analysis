"""
Data Cleaning Module for Hotel Booking Analysis
Author: Data Analytics Team
Date: December 28, 2025

This module contains functions for cleaning and preprocessing
the hotel booking dataset.
"""

import pandas as pd
import numpy as np


def remove_empty_rows(df, threshold=0.9):
    """
    Remove rows with excessive missing values.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input dataframe
    threshold : float
        Proportion of missing values required to drop row (default: 0.9)
        
    Returns:
    --------
    pd.DataFrame
        Cleaned dataframe
    int
        Number of rows removed
    """
    initial_rows = len(df)
    missing_prop = df.isnull().sum(axis=1) / len(df.columns)
    df_clean = df[missing_prop < threshold].copy()
    rows_removed = initial_rows - len(df_clean)
    
    print(f"Removed {rows_removed} rows with >{threshold*100}% missing values")
    return df_clean.reset_index(drop=True), rows_removed


def remove_impossible_bookings(df):
    """
    Remove bookings with 0 adults AND 0 children (impossible bookings).
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input dataframe
        
    Returns:
    --------
    pd.DataFrame
        Cleaned dataframe
    int
        Number of rows removed
    """
    initial_rows = len(df)
    mask = (df['no_of_adults'] == 0) & (df['no_of_children'] == 0)
    df_clean = df[~mask].copy()
    rows_removed = initial_rows - len(df_clean)
    
    print(f"Removed {rows_removed} impossible bookings (0 adults AND 0 children)")
    return df_clean.reset_index(drop=True), rows_removed


def handle_null_strings(df, columns=None):
    """
    Replace "null" strings with NaN.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input dataframe
    columns : list, optional
        Specific columns to check (default: all object columns)
        
    Returns:
    --------
    pd.DataFrame
        Cleaned dataframe
    """
    if columns is None:
        columns = df.select_dtypes(include=['object']).columns
    
    df_clean = df.copy()
    for col in columns:
        df_clean[col] = df_clean[col].replace('null', np.nan)
    
    return df_clean


def impute_missing_values(df):
    """
    Impute missing values with strategic approach.
    
    Strategy:
    - Numerical: 0 for counts/flags, median for measurements
    - Categorical: mode or 'Unknown'
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input dataframe
        
    Returns:
    --------
    pd.DataFrame
        Dataframe with imputed values
    dict
        Summary of imputation actions
    """
    df_imputed = df.copy()
    imputation_summary = {}
    
    # Columns that logically should be 0 when missing
    zero_impute_cols = [
        'required_car_parking_space',
        'repeated_guest',
        'no_of_previous_cancellations',
        'no_of_previous_bookings_not_canceled',
        'no_of_special_requests',
        'no_of_children',
        'no_of_weekend_nights',
        'no_of_week_nights'
    ]
    
    for col in zero_impute_cols:
        if col in df_imputed.columns and df_imputed[col].isnull().sum() > 0:
            missing_count = df_imputed[col].isnull().sum()
            df_imputed[col].fillna(0, inplace=True)
            imputation_summary[col] = {'method': 'zero', 'count': missing_count}
    
    # Median imputation for other numerical columns
    numerical_cols = df_imputed.select_dtypes(include=[np.number]).columns
    for col in numerical_cols:
        if col not in zero_impute_cols and df_imputed[col].isnull().sum() > 0:
            missing_count = df_imputed[col].isnull().sum()
            median_val = df_imputed[col].median()
            df_imputed[col].fillna(median_val, inplace=True)
            imputation_summary[col] = {'method': 'median', 'value': median_val, 'count': missing_count}
    
    # Mode imputation for categorical with few missing values
    if 'room_type_reserved' in df_imputed.columns and df_imputed['room_type_reserved'].isnull().sum() > 0:
        missing_count = df_imputed['room_type_reserved'].isnull().sum()
        mode_val = df_imputed['room_type_reserved'].mode()[0]
        df_imputed['room_type_reserved'].fillna(mode_val, inplace=True)
        imputation_summary['room_type_reserved'] = {'method': 'mode', 'value': mode_val, 'count': missing_count}
    
    # 'Unknown' for other categoricals
    categorical_cols = ['type_of_meal_plan', 'market_segment_type']
    for col in categorical_cols:
        if col in df_imputed.columns and df_imputed[col].isnull().sum() > 0:
            missing_count = df_imputed[col].isnull().sum()
            df_imputed[col].fillna('Unknown', inplace=True)
            imputation_summary[col] = {'method': 'unknown', 'count': missing_count}
    
    return df_imputed, imputation_summary


def encode_target(df, target_col='booking_status'):
    """
    Encode target variable: Not_Canceled → 0, Canceled → 1
    
    Parameters:
    -----------
    df : pd.DataFrame
        Input dataframe
    target_col : str
        Name of target column
        
    Returns:
    --------
    pd.DataFrame
        Dataframe with encoded target
    """
    df_encoded = df.copy()
    if target_col in df_encoded.columns:
        df_encoded[target_col] = df_encoded[target_col].map({
            'Not_Canceled': 0,
            'Canceled': 1
        })
        print(f"Encoded {target_col}: Not_Canceled → 0, Canceled → 1")
    
    return df_encoded


def clean_hotel_booking_data(df, verbose=True):
    """
    Complete cleaning pipeline for hotel booking dataset.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Raw input dataframe
    verbose : bool
        Print progress messages
        
    Returns:
    --------
    pd.DataFrame
        Fully cleaned dataframe
    dict
        Cleaning summary statistics
    """
    if verbose:
        print("="*60)
        print("HOTEL BOOKING DATA CLEANING PIPELINE")
        print("="*60)
        print(f"\nInitial dataset: {len(df)} rows, {len(df.columns)} columns")
    
    summary = {}
    
    # Step 1: Remove empty rows
    df_clean, empty_rows = remove_empty_rows(df, threshold=0.9)
    summary['empty_rows_removed'] = empty_rows
    
    # Step 2: Remove impossible bookings
    df_clean, impossible_rows = remove_impossible_bookings(df_clean)
    summary['impossible_bookings_removed'] = impossible_rows
    
    # Step 3: Handle "null" strings
    df_clean = handle_null_strings(df_clean)
    
    # Step 4: Impute missing values
    df_clean, imputation_summary = impute_missing_values(df_clean)
    summary['imputation'] = imputation_summary
    
    # Step 5: Encode target variable
    df_clean = encode_target(df_clean)
    
    if verbose:
        print(f"\nFinal dataset: {len(df_clean)} rows, {len(df_clean.columns)} columns")
        print(f"Total rows removed: {len(df) - len(df_clean)}")
        print(f"Remaining missing values: {df_clean.isnull().sum().sum()}")
        print("\n✓ Data cleaning complete!")
        print("="*60)
    
    summary['final_rows'] = len(df_clean)
    summary['final_columns'] = len(df_clean.columns)
    summary['total_removed'] = len(df) - len(df_clean)
    
    return df_clean, summary


# Example usage
if __name__ == "__main__":
    # Load data
    df = pd.read_csv('data/raw/hotel_bookings.csv')
    
    # Clean data
    df_cleaned, summary = clean_hotel_booking_data(df, verbose=True)
    
    # Save cleaned data
    df_cleaned.to_csv('data/processed/hotel_bookings_cleaned.csv', index=False)
    print("\n✓ Cleaned data saved to: data/processed/hotel_bookings_cleaned.csv")
