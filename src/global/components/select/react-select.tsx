/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import Select, { Props as SelectProps, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

export interface OptionType {
  label: string;
  value: string | number;
}

interface BaseSelectProps {
  value: OptionType | OptionType[] | null;
  onChange: (value: OptionType | OptionType[] | null) => void;
  options?: OptionType[];
  placeholder?: string;
  isClearable?: boolean;
  isMulti?: boolean;
  isCreatable?: boolean; // 👈 toggle between Select and CreatableSelect
}

export default function ReactSelectComponent({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  isClearable = true,
  isMulti = false,
  isCreatable = false,
}: BaseSelectProps) {
  const sendButtonColor = '#a855f7'; // matches your Send button

  const customStyles: StylesConfig = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      borderColor: state.isFocused ? sendButtonColor : '#d1d5db',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#eef2ff' : 'white', // light purple on hover
      color: state.isSelected ? '#4f46e5' : '#111827',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#f3e8ff', // light purple background
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: sendButtonColor,
      fontWeight: 500,
    }),
  };

  const commonProps: SelectProps<OptionType, boolean> = {
    value,
    options,
    placeholder,
    isClearable,
    isMulti,
  };

  return isCreatable ? (
    <CreatableSelect
      styles={customStyles as StylesConfig<OptionType, boolean>}
      onChange={(newValue) => {
        if (isMulti) {
          onChange(newValue as OptionType[]); // Multi
        } else {
          onChange(newValue as OptionType); // Single
        }
      }}
      {...commonProps}
    />
  ) : (
    <Select
      styles={customStyles as StylesConfig<OptionType, boolean>}
      onChange={(newValue) => {
        if (isMulti) {
          onChange(newValue as OptionType[]); // Multi
        } else {
          onChange(newValue as OptionType); // Single
        }
      }}
      {...commonProps}
    />
  );
}
