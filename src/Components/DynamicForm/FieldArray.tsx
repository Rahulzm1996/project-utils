import { Box, Button, Stack, Typography, Icon, useTheme } from '@leena/ui-components';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText } from '@mui/material';
import React, { useCallback, useEffect } from 'react';

import dashboardMessages from 'containers/AnalyticsDashboard/messages';
import { FieldMapper } from './FieldMapper';
import { FieldArrayProps } from './types';
import { getTranslateMessage } from 'utils/utils';
import get from 'lodash/get';

const FieldArray = (props: FieldArrayProps) => {
  const theme = useTheme();
  const { control, formState, getFieldState } = useFormContext();
  const { formField, onFieldChange, formMethods } = props || {};
  const w = formMethods.watch();
  const {
    name,
    title,
    options,
    isRequired,
    isDisabled,
    rules,
    componentType,
    placeholder,
    dependentOn,
    fields: fieldArrayFields,
    limit,
    props: fieldProps
  } = formField || {};
  const { addBlankRow } = fieldProps || {};

  const { append, fields, remove } = useFieldArray({
    control,
    name,
    shouldUnregister: true,
    rules
  });

  const { error } = getFieldState(name, formState);

  const addItem = useCallback(() => {
    //checks if all the child field have name property
    const rowDefaultValue = fieldArrayFields?.every(field => (field?.name ? true : false))
      ? {}
      : '';

    append(
      typeof rowDefaultValue === 'object'
        ? {
            ...fieldArrayFields?.reduce<Record<string, unknown>>((acc, fieldConfig) => {
              acc[fieldConfig?.name] = fieldConfig.defaultValue ?? undefined;
              return acc;
            }, {})
          }
        : ''
    );
  }, [append, fields.length, fieldArrayFields, rules?.maxLength?.value, limit]);

  useEffect(() => {
    if (addBlankRow && fields.length === 0) {
      addItem();
    }
  }, [addBlankRow, addItem, fields.length]);

  return (
    <Stack className="fieldsArrayContainer" gap={2}>
      <FormControl disabled={isDisabled} required={!!rules?.required}>
        <Stack className="fieldsContainer" gap={4}>
          {fields?.map?.((item, index) => {
            const { id } = item;

            return (
              <Stack key={id.toString()}>
                <Stack className="filtersContainer" direction="row" justifyContent="space-between">
                  <Typography variant="captionMedium" color={theme => theme.palette.text.secondary}>
                    {`${title} ${index + 1}`}
                  </Typography>
                  {addBlankRow && index === 0 ? null : (
                    <Button
                      color="P-50"
                      disableElevation
                      size="small"
                      variant="ghost"
                      className="removeButton"
                      onClick={() => {
                        remove(index);
                        onFieldChange(name, '', null);
                      }}
                    >
                      {getTranslateMessage(dashboardMessages.remove)}
                    </Button>
                  )}
                </Stack>

                <Box className="filtersFieldsContainer" key={id}>
                  {fieldArrayFields?.map((childField, subIdx) => {
                    return (
                      <Controller
                        shouldUnregister
                        key={`${formField.name}.${index}.${childField.name}-${subIdx}`}
                        name={`${formField.name}.${index}.${childField.name}` as never}
                        control={formMethods.control}
                        rules={{ ...childField?.rules }}
                        render={({ field, fieldState }) => {
                          const fieldName = `${formField.name}.${index}.${childField.name}`;
                          return (
                            <FieldMapper
                              {...field}
                              //@ts-ignore
                              fields={fields}
                              formField={childField}
                              formData={formMethods.getValues()}
                              onChange={event => {
                                field.onChange(event);
                                onFieldChange(
                                  `${formField.name}.${index}.${childField.name}`,
                                  childField,
                                  event
                                );
                              }}
                              fieldState={fieldState}
                              error={get(formMethods.formState.errors, fieldName)?.message}
                            />
                          );
                        }}
                      />
                    );
                  })}
                </Box>
              </Stack>
            );
          })}
        </Stack>

        {!limit || fields?.length !== limit ? (
          <Button
            disableElevation
            size="small"
            variant="ghost"
            className="commonButton"
            startIcon={<Icon iconName="Plus" />}
            onClick={addItem}
            sx={{
              width: 'fit-content',
              marginTop: theme.spacing(2)
            }}
          >
            {`Add ${title}`}
          </Button>
        ) : null}

        {error?.root?.message ? (
          <FormHelperText error={!!error}>{error?.root?.message}</FormHelperText>
        ) : null}
      </FormControl>
    </Stack>
  );
};

export { FieldArray };
