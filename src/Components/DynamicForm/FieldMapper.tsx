import {
    AsyncSelect,
    Box,
    Circular,
    Stack,
    Select,
    RadioGroup,
    Textarea,
    TextField,
    Tooltip,
    Typography,
    SwitchWithLabel,
    Icon,
    useTheme,
    Divider,
    NestedDropDown,
    onOptionSelect,
    collectSelectedLeafOptions,
    FormControl,
    FormLabel
  } from '@leena/ui-components';
  import { components } from 'react-select';
  import styled from 'styled-components';
  import { isEmpty, omit } from 'lodash';
  import type { ControlProps, OptionProps, MenuListProps, Option } from 'react-select';
  import React, { useEffect, useState, forwardRef, useCallback, useMemo } from 'react';
  import { useParams } from 'react-router-dom';
  import get from 'lodash/get';
  
  import { analyticsApi } from 'utils/apiConfig';
  import { getBaseUrl, isEmptyValues } from 'utils/utils';
  import { IParams, SelectionType } from 'containers/AnalyticsDashboard/types';
  
  import { IFieldMapperProps, IFormDefaultValue } from './types';
  import { injectNestedDropdownProperties } from 'containers/AnalyticsDashboard/utils/common';
  import { useDispatch } from 'react-redux';
  import { useAPICaller } from 'containers/AnalyticsDashboard/hook';
  
  export const Wrapper = styled.div`
    .MuiFormLabel-root {
      width: max-content;
      gap: unset;
    }
  
    .form-field-helpText {
      font-size: 12px;
      font-weight: normal;
    }
  
    .form-field-error {
      color: #ff5252;
    }
  `;
  
  interface CustomOption {
    label: string;
    value: string;
    iconProps?: any;
    isDisabled?: boolean;
    tooltipText?: string;
  }
  
  const Option = (props: OptionProps<CustomOption>) => {
    const { data, children } = props;
  
    const optionContent = (
      <components.Option {...props}>
        <Stack
          sx={theme => ({
            flexDirection: 'row',
            spacing: theme.spacing(2),
            alignItems: 'center',
            opacity: data.disabled ? 0.5 : 1
          })}
        >
          {!isEmpty(data?.iconProps) && <Icon {...data?.iconProps} />}
          <Typography variant="bodyMedium">{children}</Typography>
        </Stack>
      </components.Option>
    );
  
    // If option has disabled and tooltipText properties
    if (data.disabled && data.tooltipText) {
      return (
        <Tooltip title={data.tooltipText} arrow={false}>
          <div style={{ cursor: 'not-allowed' }}>{optionContent}</div>
        </Tooltip>
      );
    }
  
    return optionContent;
  };
  
  const Control = (props: ControlProps) => {
    const { children, ...restProps } = props;
    const iconProps = restProps?.selectProps?.value?.iconProps;
    return (
      <components.Control {...restProps}>
        <Stack direction="row" spacing={2} alignItems="center" width="100%">
          {!isEmpty(iconProps) && <Icon {...iconProps} />}
          {children}
        </Stack>
      </components.Control>
    );
  };
  
  const DropdownIndicator = ({ selectProps: { menuIsOpen } }) => (
    <Icon iconName={menuIsOpen ? 'CaretUp' : 'CaretDown'} size={14} weight="bold" />
  );
  
  const MultiValueContainer = ({ selectProps, data }) => {
    const value = data.value;
    const allSelected = selectProps.value;
    const index = allSelected.findIndex(selected => selected.value === value);
    const isLastSelected = index === allSelected.length - 1;
    const count = isLastSelected ? `${allSelected.length} selected` : '';
  
    return count;
  };
  
  const getOptionsUrl = (endPoint = '', botId, formData, filterIndex = 0, query = '') => {
    const { product, panelType, filters, metric } = formData ?? {};
  
    const { filtersMetric } = filters?.[filterIndex] ?? {};
  
    if (endPoint.includes(':botId')) {
      endPoint = endPoint.replace(':botId', botId);
    }
    if (endPoint.includes(':panelType')) {
      endPoint = endPoint.replace(':panelType', panelType?.value ?? '');
    }
    if (endPoint.includes(':metricId')) {
      endPoint = endPoint.replace(':metricId', metric?.value ?? '');
    }
    if (endPoint.includes(':key')) {
      endPoint = endPoint.replace(':key', filtersMetric?.value ?? '');
    }
    if (endPoint.includes(':product')) {
      endPoint = endPoint.replace(':product', product?.value ?? '');
    }
    if (query) {
      endPoint = endPoint + `?q=${query}`;
    }
  
    return getBaseUrl('REACT_APP_API_ANALYTICS_URL') + endPoint;
  };
  
  const getElement = props => {
    const theme = useTheme();
    const { botId } = useParams<IParams>();
    const { formField: field, formData, error, onBlur, filterIndex } = props;
    const helpText = field?.helpText ?? '';
  
    switch (field?.componentType) {
      case 'HEADING':
      case 'heading':
        return (
          <>
            <Typography variant="subHeadingMedium" title={props?.title}>
              {props?.name}
            </Typography>
          </>
        );
  
      case 'DIVIDER':
      case 'divider':
        const { margin = 0 } = field?.props || {};
        return <Divider margin={margin} />;
  
      case 'SWITCH':
      case 'switch':
        const { variant = 'standard' } = field?.props || {};
        return (
          <>
            <SwitchWithLabel
              label={field?.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props?.onChange(e?.target?.checked);
              }}
              value={props?.value}
              checked={props?.value}
              onBlur={onBlur}
              variant={variant}
              helperText={''}
            />
          </>
        );
  
      case 'INPUT':
      case 'input':
        return (
          <>
            <TextField
              autoComplete={field?.autoComplete}
              required={!!field?.rules?.required}
              disabled={field.isDisabled ?? false}
              key={field?.name}
              label={field?.title}
              name={field?.key}
              placeholder={field?.placeholder}
              value={props?.value}
              onChange={props?.onChange}
              onBlur={onBlur}
              autoFocus={field?.autoFocus}
              InputProps={
                field?.withCustomStyle
                  ? {
                    sx: {
                      '&.Mui-focused': {
                        filter: `drop-shadow(0px 0px 2px ${theme.palette['P-50']})`
                      }
                    }
                  }
                  : {}
              }
            />
  
            {helpText ? (
              <Typography variant="captionMedium" className="form-field-helpText">
                {helpText}
              </Typography>
            ) : null}
  
            {error ? (
              <Typography variant="captionMedium" className="form-field-error">
                {error}
              </Typography>
            ) : null}
          </>
        );
  
      case 'INPUT-WITH-DROPDOWN':
      case 'input-with-dropdown': {
        const dropdownConfig = field.dropdownField || {};
  
        const textFieldValue = props?.value?.[field?.name];
        const dropdownValue = props?.value?.[dropdownConfig?.name] ?? dropdownConfig?.options?.[0];
  
        const handleInputDropdownChange = (value, fieldName, fieldType) => {
          let customValue =
            !isEmpty(props?.value) && typeof props?.value === 'object' ? { ...props?.value } : {};
          customValue[fieldName] = value;
          if (customValue[fieldName]) {
            customValue[fieldName] = value;
          } else {
            customValue[fieldName] = value;
          }
          props?.onChange(customValue);
        };
  
        return (
          <Stack gap="4px">
            <FormControl
              error={error}
              required={!!field?.rules?.required}
              disabled={field?.isDisabled}
            >
              {field?.title ? (
                <FormLabel required={!!field?.rules?.required}>{field.title}</FormLabel>
              ) : null}
  
              <Stack sx={{ width: '100%', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                <TextField
                  autoComplete={field?.autoComplete}
                  required={!!field?.rules?.required}
                  disabled={field.isDisabled ?? false}
                  key={field?.name}
                  label={''}
                  name={field?.key}
                  placeholder={field?.placeholder}
                  value={textFieldValue}
                  type="number"
                  inputProps={field?.props?.inputProps ?? {}}
                  onChange={e => {
                    handleInputDropdownChange(
                      !isEmptyValues(e?.target?.value) ? parseInt(e?.target?.value) : undefined,
                      field?.name,
                      'input'
                    );
                  }}
                  onBlur={onBlur}
                  autoFocus={field?.autoFocus}
                  InputProps={
                    field?.withCustomStyle
                      ? {
                        sx: {
                          '&.Mui-focused': {
                            filter: `drop-shadow(0px 0px 2px ${theme.palette['P-50']})`
                          }
                        }
                      }
                      : {}
                  }
                />
  
                <Select
                  isClearable={dropdownConfig?.isClearable}
                  isMulti={dropdownConfig?.isMulti}
                  isDisabled={dropdownConfig?.isDisabled}
                  required={!!dropdownConfig?.rules?.required}
                  key={dropdownConfig?.name}
                  label={dropdownConfig?.title}
                  name={dropdownConfig?.key}
                  options={dropdownConfig?.options}
                  placeholder={dropdownConfig?.placeholder}
                  value={dropdownValue ?? null}
                  onChange={option =>
                    handleInputDropdownChange(option, dropdownConfig?.name, 'dropdown')
                  }
                  onBlur={onBlur}
                  menuPlacement="auto"
                  components={
                    dropdownConfig?.withCustomComponents
                      ? { Option, Control, DropdownIndicator }
                      : { DropdownIndicator }
                  }
                  customStyles={
                    dropdownConfig?.withCustomStyle
                      ? {
                        control: (styles, { menuIsOpen, isDisabled, isFocused }) => ({
                          boxShadow: isFocused ? `0px 0px 2px ${theme.palette['P-50']}` : 'none',
                          '& > .MuiBox-root': {
                            marginRight: theme.spacing(2)
                          }
                        })
                      }
                      : {}
                  }
                />
              </Stack>
  
              {helpText && !error ? (
                <Typography variant="captionMedium" color="D-40" className="form-field-helpText">
                  {helpText}
                </Typography>
              ) : null}
  
              {error ? (
                <Typography variant="captionMedium" className="form-field-error">
                  {error}
                </Typography>
              ) : null}
            </FormControl>
          </Stack>
        );
      }
  
      case 'TEXTAREA':
      case 'textarea':
        return (
          <>
            <Textarea
              autoComplete={field?.autoComplete}
              required={!!field?.rules?.required}
              disabled={field.isDisabled ?? false}
              key={field?.name}
              label={field?.title}
              name={field?.key}
              placeholder={field?.placeholder}
              rows={field?.rows}
              maxRows={3}
              value={props?.value}
              onChange={props?.onChange}
              onBlur={onBlur}
              InputProps={
                field?.withCustomStyle
                  ? {
                    sx: {
                      '&.Mui-focused': {
                        filter: `drop-shadow(0px 0px 2px ${theme.palette['P-50']})`
                      }
                    }
                  }
                  : {}
              }
            />
  
            {helpText ? (
              <Typography variant="captionMedium" className="form-field-helpText">
                {helpText}
              </Typography>
            ) : null}
  
            {error ? (
              <Typography variant="captionMedium" className="form-field-error">
                {error}
              </Typography>
            ) : null}
          </>
        );
  
      case 'SELECT':
      case 'select':
        return (
          <>
            <Select
              isClearable={field?.isClearable}
              isMulti={field?.isMulti}
              isDisabled={field?.isDisabled}
              required={!!field?.rules?.required}
              key={field?.name}
              label={field?.title}
              name={field?.key}
              options={field?.options}
              placeholder={field?.placeholder}
              value={props?.value ?? null}
              onChange={props?.onChange}
              onBlur={onBlur}
              menuPlacement="auto"
              components={
                field?.withCustomComponents
                  ? { Option, Control, DropdownIndicator }
                  : { DropdownIndicator }
              }
              customStyles={
                field?.withCustomStyle
                  ? {
                    control: (styles, { menuIsOpen, isDisabled, isFocused }) => ({
                      boxShadow: isFocused ? `0px 0px 2px ${theme.palette['P-50']}` : 'none',
                      '& > .MuiBox-root': {
                        marginRight: theme.spacing(2)
                      }
                    })
                  }
                  : {}
              }
            />
  
            {helpText ? (
              <Typography variant="captionMedium" className="form-field-helpText">
                {helpText}
              </Typography>
            ) : null}
  
            {error ? (
              <Typography variant="captionMedium" className="form-field-error">
                {error}
              </Typography>
            ) : null}
          </>
        );
  
      case 'ASYNC-SELECT':
      case 'async-select': {
        const [value, setValue] = useState(field?.isMulti ? [] : null);
        const optionsUrl = getOptionsUrl(field?.endPoint, botId, formData, filterIndex, '');
        const showFilteredOptions = field?.showFilteredOptions;
        let allOptionsUnderFieldName = [];
        if (showFilteredOptions) {
          const fieldName = field?.name;
          const allFields = props?.fields;
  
          allFields?.forEach?.(singleField => {
            if (!isEmpty(singleField[fieldName])) {
              if (Array.isArray(singleField[fieldName])) {
                allOptionsUnderFieldName = allOptionsUnderFieldName.concat(singleField[fieldName]);
              } else {
                allOptionsUnderFieldName.push(singleField[fieldName]);
              }
            }
          });
        }
  
        const loadOptions = useCallback(
          async query => {
            const response = await analyticsApi.get(
              getOptionsUrl(field?.endPoint, botId, formData, filterIndex, query)
            );
  
            let tempOptions = response?.data || [];
            try {
              if (tempOptions?.result || tempOptions?.panels) {
                tempOptions = tempOptions?.result || tempOptions?.panels;
              }
  
              //added for table groupby dropdown options
              if (!Array.isArray(tempOptions) && field.responsePath) {
                return {
                  options: tempOptions[field.responsePath] || []
                };
              }
  
              if (field?.tranformOption) {
                tempOptions = tempOptions.map(option => field?.tranformOption(option));
              }
  
              return {
                options: showFilteredOptions
                  ? tempOptions?.filter(ele => {
                    return !allOptionsUnderFieldName.some?.(el => {
                      return el?.value === ele?.value;
                    });
                  })
                  : tempOptions
              };
            } catch (error) {
              return {
                options: tempOptions
              };
            }
          },
          [optionsUrl]
        );
  
        return (
          <>
            <AsyncSelect
              isClearable={field?.isClearable}
              isMulti={field?.isMulti}
              isDisabled={field?.isDisabled}
              required={!!field?.rules?.required}
              key={optionsUrl + field?.name}
              label={field?.title}
              name={field?.key}
              loadOptions={loadOptions}
              debounceTimeout={300}
              placeholder={field?.placeholder}
              value={props.value}
              onChange={event => {
                setValue(event);
                props?.onChange?.(event);
              }}
              isOptionDisabled={option => !!option.disabled} // Use the transformed disabled property
              onBlur={onBlur}
              menuPlacement="auto"
              closeMenuOnSelect={field?.isMulti ? false : true}
              hideSelectedOptions={false}
              components={{
                Option,
                Control,
                DropdownIndicator,
                MultiValueContainer
              }}
              customStyles={
                field?.withCustomStyle
                  ? {
                    control: (styles, { menuIsOpen, isDisabled, isFocused }) => ({
                      boxShadow: isFocused ? `0px 0px 2px ${theme.palette['P-50']}` : 'none'
                    })
                  }
                  : {}
              }
            />
  
            {helpText ? (
              <Typography variant="captionMedium" className="form-field-helpText">
                {helpText}
              </Typography>
            ) : null}
  
            {error ? (
              <Typography variant="captionMedium" className="form-field-error">
                {error}
              </Typography>
            ) : null}
          </>
        );
      }
  
      case 'NESTED_DROPDOWN':
      case 'nested-dropdown': {
        const { cachedApiCaller } = useAPICaller();
        const [nestedDropdownState, setNestedDropdownState] = useState({
          menuConfig: {
            headerItems: [
              {
                key: 'searchBar'
              }
            ],
            menu: [],
            selectionType: SelectionType.SINGLE
          },
          loading: false
        });
        const { menuConfig, loading } = nestedDropdownState || {};
        const optionsUrl = getOptionsUrl(field?.endPoint, botId, formData, filterIndex, '');
        const { defaultValue = [] } = props?.value || {};
  
        const mergeWithDefaultValues = useCallback(
          options => {
            let updatedOptions = options;
            defaultValue?.forEach(item => {
              updatedOptions = onOptionSelect({
                menuConfig: { ...menuConfig, menu: updatedOptions },
                openedMenuKeys: [...item.path, item.value],
                value: true,
                selectionType: SelectionType.MULTI
              });
            });
            return updatedOptions;
          },
          [defaultValue, menuConfig]
        );
  
        const fetchOptions = useCallback(async ({ optionsUrl }) => {
          return await analyticsApi.get(optionsUrl);
        }, []);
  
        const loadOptions = useCallback(async () => {
          setNestedDropdownState(prev => ({ ...prev, loading: true }));
          //catch the api response for nested dropdown options
          const response = await cachedApiCaller({ optionsUrl }, fetchOptions);
          const options = injectNestedDropdownProperties(response?.data?.result) || [];
  
          const updatedOptions = mergeWithDefaultValues(options);
          setNestedDropdownState(prev => ({
            ...prev,
            loading: false,
            menuConfig: { ...prev.menuConfig, menu: updatedOptions }
          }));
        }, [optionsUrl]);
  
        //reset the dependent dropdown based on parent dropdown value change(changes the url)
        useEffect(() => {
          loadOptions();
        }, [optionsUrl]);
  
        return (
          <FormControl error={error} required={!!field?.rules?.required} disabled={field?.isDisabled}>
            {field?.title ? (
              <FormLabel required={!!field?.rules?.required}>{field.title}</FormLabel>
            ) : null}
            <NestedDropDown
              dropDownTriggerProps={{
                category: 'box',
                clearable: true,
                customLabelComponent: loading ? (
                  <Stack
                    sx={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography
                      variant="descriptionMedium"
                      color={theme => theme.palette.text.secondary}
                    >
                      Select
                    </Typography>
                    <Circular color="D-50" size={16} />
                  </Stack>
                ) : null
              }}
              footerConfig={{
                hideFooter: true
              }}
              nestedDropDownMenuProps={{
                componentState: {
                  currentState: loading ? 'loading' : null
                },
                closeOnSelect: true,
                menuConfig: menuConfig
              }}
              type="controlled"
              onChange={updatedMenu =>
                setNestedDropdownState(prev => ({ ...prev, menuConfig: updatedMenu }))
              }
              onApply={options => {
                /*
                It processes the selected options from a menu, extracts relevant data from each selected leaf node, constructs a defaultValue and selectedOptions array, and passes them to a callback function props.onChange. If no options are selected, it calls the callback with null.
              */
                const selectedOptionsConfig = collectSelectedLeafOptions(options?.menu);
                let selectedOptions = [];
                const defaultValue = selectedOptionsConfig?.map(option => {
                  const { leafNodeData, parentPath } = option;
  
                  selectedOptions.push(
                    omit(leafNodeData, [
                      'key',
                      'showInTriggerComponent',
                      'selectedState',
                      'subMenuConfig'
                    ])
                  );
                  let path = [];
                  if (Array.isArray(parentPath) && parentPath.length > 0) {
                    path = [...parentPath.map(el => el.key)];
                  }
                  return {
                    path: path,
                    value: leafNodeData.key
                  };
                });
                if (!isEmpty(selectedOptions)) {
                  props?.onChange?.({ defaultValue, selectedOptions });
                } else {
                  props?.onChange?.(null);
                }
              }}
              variant="fieldSearch"
            />
  
            {helpText ? (
              <Typography variant="captionMedium" className="form-field-helpText">
                {helpText}
              </Typography>
            ) : null}
  
            {error ? (
              <Typography variant="captionMedium" className="form-field-error">
                {error}
              </Typography>
            ) : null}
          </FormControl>
        );
      }
  
      case 'RADIO-GROUP':
        return (
          <>
            <RadioGroup
              required={!!field?.rules?.required}
              key={field?.name}
              label={field?.title}
              name={field?.name}
              options={field?.options ?? []}
              value={props?.value}
              onChange={props?.onChange}
              onBlur={onBlur}
            />
  
            {helpText ? (
              <Typography variant="captionMedium" className="form-field-helpText">
                {helpText}
              </Typography>
            ) : null}
  
            {error ? (
              <Typography variant="captionMedium" className="form-field-error">
                {error}
              </Typography>
            ) : null}
          </>
        );
  
      default:
        return null;
    }
  };
  
  const FieldMapper = forwardRef<HTMLAllCollection, IFieldMapperProps>((props, ref) => (
    <Wrapper>{getElement(props)}</Wrapper>
  ));
  
  export { FieldMapper };
  