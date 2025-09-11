/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';
import { components, StylesConfig } from 'react-select';
import { vouchifyApi } from '@/global/utils/api';

export interface OptionType {
  label: string;
  value: string | number;
}
const sendButtonColor = '#a855f7'; // matches your Send button

interface AsyncPaginateSelectProps {
  value: OptionType[] | OptionType | null;
  onChange: (value: OptionType[] | OptionType) => void;
  url: string; // 👈 API endpoint
  labelKey?: string; // 👈 which field to show as label
  valueKey?: string; // 👈 which field to use as value
  placeholder?: string;
  debounceTimeout?: number;
  isClearable?: boolean;
  isMulti?: boolean;
}

export default function AsyncPaginateSelect({
  value,
  onChange,
  url,
  labelKey = 'name',
  valueKey = 'id',
  placeholder = 'Select...',
  debounceTimeout = 500,
  isClearable = true,
  isMulti = false,
}: AsyncPaginateSelectProps) {
  const loadOptions: LoadOptions<OptionType, any, { page: number }> = async (
    search,
    _loadedOptions,
    additional
  ) => {
    const page = additional?.page ?? 0; // 👈 safe default if undefined
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...(search && { search }),
    });

    try {
      const result = await vouchifyApi.request(`${url}?${params}`, {
        method: 'GET',
      });

      const options: OptionType[] = result?.data?.map((item: any) => ({
        value: item[valueKey],
        label: item[labelKey],
      }));

      return {
        options,
        hasMore: options.length === 10, // 👈 assumes pagination
        additional: { page: page + 1 },
      };
    } catch (err) {
      console.error('Error loading options:', err);
      return { options: [], hasMore: false, additional: { page: 0 } };
    }
  };

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
  return (
    <AsyncPaginate
      value={value}
      styles={customStyles as StylesConfig<OptionType, boolean>}
      loadOptions={loadOptions}
      onChange={(newValue) => {
        if (isMulti) {
          onChange(newValue as OptionType[]); // Multi
        } else {
          onChange(newValue as OptionType); // Single
        }
      }}
      additional={{ page: 0 }}
      debounceTimeout={debounceTimeout}
      placeholder={placeholder}
      isClearable={isClearable}
      isMulti={isMulti}
      components={{
        DropdownIndicator: (props) => (
          <components.DropdownIndicator {...props} />
        ),
      }}
    />
  );
}
