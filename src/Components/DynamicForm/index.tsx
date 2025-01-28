import { Box, Stack } from '@leena/ui-components';
import { FormProvider, useForm, Controller, useFieldArray } from 'react-hook-form';
import get from 'lodash/get';
import { isEmpty, omit } from 'lodash';
import React, { memo, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { analyticsApi as api } from 'utils/apiConfig';
import { showSnackBar } from 'containers/AnalyticsDashboard/actions';

import {
  addNewPanelFormConfig,
  checkIfAllFieldsHaveValueForUserJourney,
  prepareFilters,
  prepareUserJourneyDataPayload,
  shouldRenderField
} from '../utils';
import { customDashUrlConfig, AnalyticsAPIParams } from '../../urlConfig';
import { FieldMapper } from './FieldMapper';
import { ChartTypes, Fieldkeys, IPanelEditorProps } from './types';
import { PanelInfo } from './PanelInfo';
import { PanelEditorFilter } from './PanelEditorFilter';
import { PanelEditorWrapper, StyledPanelEditorForm } from './styles';
import { RootState, IStoreState } from '../../types';
import { getTimeZoneValues } from 'utils/utils';
import { FieldArray } from './FieldArray';

const formDafaultValue = {
  panelType: null,
  panelName: '',
  panelDescription: '',
  metric: null,
  groupBy: null,
  isStacked: false,
  columnsName: null,
  yAxisTitle: '',
  prefix: '',
  suffix: '',
  filters: []
};

const PanelEditor = (props: IPanelEditorProps) => {
  const panelControlsRef = useRef(null);
  const { botId } = useParams<AnalyticsAPIParams>();
  const { editPanelFormConfig } = props ?? {};
  const dispatch = useDispatch();
  const analytics = useSelector<RootState>(state => state?.analyticsV2) as IStoreState;
  const abortControllerRef = useRef(null);

  const [panelTypeChanged, setPanelTypeChanged] = useState(false);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);

  const dateRange = analytics?.dateRange;

  const formMethods = useForm({
    mode: 'all',
    defaultValues: editPanelFormConfig?.panel?.formData ?? formDafaultValue,
    shouldUnregister: true
  });

  const formState = formMethods.formState;
  const w = formMethods.watch();
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'filters',
    shouldUnregister: true
  });

  const fetchPanelData = async ({ metric, queryStringValues }) => {
    abortControllerRef?.current?.abort?.();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    if (isEmpty(metric)) {
      setChartData({});
      return;
    }

    try {
      setLoading(true);
      const { status, data } = await api.get(customDashUrlConfig.fetchPanelData({ botId: botId }), {
        signal: controller.signal,
        params: queryStringValues
      });
      if (status === 200) {
        const { result, isSuccess, showMessage, message } = data;
        setChartData(result);

        //showing message when you select more than 5 metrics
        if (showMessage && message) {
          setChartData({});
          dispatch(
            showSnackBar({
              message: message
            })
          );
        }
      } else {
        setChartData({});
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Handle non-abort errors here
        console.error('Error occurred while fetching chart data', error);
      }
    } finally {
      // Only set loading to false if this request's controller is still the active one
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const fetchUserJourneyPanelData = async ({ queryStringValues, payload }) => {
    abortControllerRef?.current?.abort?.();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    try {
      const { status, data } = await api.post(
        customDashUrlConfig.fetchUserJourneyPanelData({ botId: botId }),
        payload,
        {
          params: queryStringValues,
          signal: controller.signal
        }
      );
      if (status === 200) {
        const { result, isSuccess, showMessage, message } = data;
        setChartData(result);
      } else {
        setChartData({});
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Handle non-abort errors here
        console.error('Error occurred while fetching chart data', error);
      }
    } finally {
      // Only set loading to false if this request's controller is still the active one
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const onFieldChange = (fieldKey: Fieldkeys, formField, event) => {
    const {
      panelType,
      panelName,
      panelDescription,
      filters,
      metric,
      groupBy,
      steps,
      timeWindowValue,
      funnelViewBy,
      isOrdered
    } = formMethods.getValues() ?? {};

    const panelTypeValue = get(panelType, 'value') ?? '';

    if (fieldKey === Fieldkeys.panelType) {
      if (!isEmpty(chartData)) {
        setPanelTypeChanged(true);
      } else {
        setPanelTypeChanged(false);
      }

      formMethods.reset({
        ...formDafaultValue,
        panelType: panelType,
        metric: null
      });

      setChartData({});
    }

    //reset filtersAttributes
    if (fieldKey?.endsWith(Fieldkeys.filtersMetric)) {
      let fieldNameToBeReset = fieldKey?.split('.');
      fieldNameToBeReset[fieldNameToBeReset.length - 1] = Fieldkeys.filtersAttributes;
      let keyToReset = fieldNameToBeReset.join('.');
      //@ts-ignore
      formMethods.setValue(keyToReset, null);
    }

    //added to reset the columns name field when you change the metric
    if (panelTypeValue === ChartTypes.TABLE && fieldKey === Fieldkeys.metric) {
      formMethods.reset({
        ...formDafaultValue,
        panelType: panelType,
        panelName: panelName,
        panelDescription: panelDescription,
        metric: metric,
        filters: filters,
        columnsName: null
      });
    }

    if (
      [Fieldkeys.funnelViewBy, Fieldkeys.timeWindowValue, Fieldkeys.isOrdered].includes(fieldKey) ||
      fieldKey.startsWith(Fieldkeys.steps) ||
      fieldKey?.endsWith(Fieldkeys.filtersAttributes)
    ) {
      if (
        panelTypeValue === ChartTypes.USER_JOURNEY &&
        checkIfAllFieldsHaveValueForUserJourney({ steps, isOrdered, funnelViewBy, timeWindowValue })
      ) {
        let queryStringValues = {
          ...dateRange?.value,
          timezone: getTimeZoneValues().timeZone,
          isCustomMetric: true
        };

        if (!isEmpty(filters)) {
          queryStringValues = {
            ...queryStringValues,
            ...prepareFilters({ formFilters: filters })
          };
        }
        if (!isEmpty(groupBy)) {
          queryStringValues = { ...queryStringValues, groupBy: groupBy?.value };
        }

        const payload = prepareUserJourneyDataPayload({ formData: formMethods.getValues() });
        fetchUserJourneyPanelData({ queryStringValues, payload });
        return;
      }
    }

    if (
      [Fieldkeys.metric, Fieldkeys.groupBy].includes(fieldKey) ||
      fieldKey?.endsWith(Fieldkeys.filtersAttributes)
    ) {
      if (!isEmpty(panelType)) {
        let queryStringValues = {
          ...dateRange?.value,
          panelType: panelTypeValue,
          metricId: Array.isArray(metric)
            ? metric?.map?.(options => options?.value)
            : metric?.value,
          isMulti: formField?.isMulti,
          timezone: getTimeZoneValues().timeZone,
          isCustomMetric: true
        };
        if (!isEmpty(filters)) {
          queryStringValues = { ...queryStringValues, ...prepareFilters({ formFilters: filters }) };
        }
        if (!isEmpty(groupBy)) {
          queryStringValues = { ...queryStringValues, groupBy: groupBy?.value };
        }
        fetchPanelData({ metric, queryStringValues });
      }
    }
  };

  useEffect(() => {
    const { panelType, filters, metric, groupBy } = editPanelFormConfig?.panel?.formData ?? {};

    const panelTypeValue = get(panelType, 'value') ?? '';

    if (!isEmpty(panelType)) {
      let queryStringValues = {
        ...dateRange?.value,
        panelType: panelTypeValue,
        metricId: Array.isArray(metric) ? metric?.map?.(options => options?.value) : metric?.value,
        timezone: getTimeZoneValues().timeZone,
        isCustomMetric: true
      };
      if (!isEmpty(filters)) {
        queryStringValues = { ...queryStringValues, ...prepareFilters({ formFilters: filters }) };
      }
      if (!isEmpty(groupBy)) {
        queryStringValues = { ...queryStringValues, groupBy: groupBy?.value };
      }

      if (!isEmpty(panelType) && panelTypeValue === ChartTypes.USER_JOURNEY) {
        let queryString = omit(queryStringValues, ['metricId']);

        const payload = prepareUserJourneyDataPayload({
          formData: editPanelFormConfig?.panel?.formData
        });
        fetchUserJourneyPanelData({ queryStringValues: queryString, payload });
        return;
      }

      fetchPanelData({ metric, queryStringValues });
    }

    return () => {
      abortControllerRef?.current?.abort?.();
    };
  }, [editPanelFormConfig]);

  const scrollToBottom = () => {
    panelControlsRef?.current?.scrollIntoView?.({
      behavior: 'smooth',
      block: 'end',
      inline: 'start'
    });
  };

  return (
    <PanelEditorWrapper>
      <FormProvider {...formMethods}>
        <StyledPanelEditorForm noValidate>
          <Box className="controlsContainer">
            {addNewPanelFormConfig({ panelTypeValue: w.panelType?.value })?.map(
              (formField, idx) => {
                const dependentField = formField.dependentOn ?? '';
                const dependentValue: any = w[dependentField?.name as never] ?? '';

                if (
                  formField.componentType === 'fieldArray' &&
                  shouldRenderField({ w, dependentField, dependentValue })
                ) {
                  return (
                    <Stack key={`${formField.name}-${formField.componentType}-${idx}`}>
                      <FieldArray
                        key={`${formField.name}-${formField.componentType}-${idx}`}
                        //@ts-ignore
                        formField={formField}
                        onFieldChange={onFieldChange}
                        formMethods={formMethods}
                      />
                    </Stack>
                  );
                }

                return shouldRenderField({ w, dependentField, dependentValue }) ? (
                  <>
                    <Controller
                      shouldUnregister={true}
                      key={`${formField.name}-${idx.toString()}`}
                      name={formField.name as never}
                      control={formMethods.control}
                      rules={formField?.rules}
                      defaultValue={formField?.defaultValue ?? null}
                      render={({ field }) => (
                        <FieldMapper
                          {...field}
                          formField={formField}
                          formData={w}
                          onChange={event => {
                            field.onChange(event);
                            onFieldChange(formField?.name, formField, event);
                          }}
                          error={get(formMethods.formState.errors, field?.name)?.message}
                        />
                      )}
                    />
                  </>
                ) : null;
              }
            )}

            <PanelEditorFilter
              fields={fields}
              remove={remove}
              onFieldChange={onFieldChange}
              scrollToBottom={scrollToBottom}
              append={append}
            />

            <Box ref={panelControlsRef}></Box>
          </Box>

          <PanelInfo
            closeDialog={props?.closeDialog}
            chartData={chartData}
            dateRange={dateRange}
            loading={loading}
            editPanelFormConfig={editPanelFormConfig}
            panelTypeChanged={panelTypeChanged}
          />
        </StyledPanelEditorForm>
      </FormProvider>
    </PanelEditorWrapper>
  );
};
const MPanelEditor = memo(PanelEditor);
export { MPanelEditor as PanelEditor };
