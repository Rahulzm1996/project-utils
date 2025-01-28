import { IconState, BaseChartProps, Box, Typography, theme } from '@leena/ui-components';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import dashboardMessages from 'containers/AnalyticsDashboard/messages';
import { getTimeZoneValues, getTranslateMessage } from 'utils/utils';

import DateUtils from '../utils/dateFormatter';
import { formatNumberWithDecimals, highlightLabel } from '../utils/common';
import { transformer } from './DashboardGrid/transformer';
import { AppliedFiltersTooltip, Title } from './components/AppliedFiltersTooltipTitle';
import { ChartActionsConfigProps } from './DashboardGrid/types';
import useClickableLinks from 'hooks/useClickableLinks';
import { DATA_TYPES, IStoreState } from '../types';
import {
  ChartTypes
} from '../utils/chartUtils';
import { IFormDefaultValue } from './PanelEditor/types';
import StyledAppliedFiltersChip from './components/StyledAppliedFiltersChip';
import { renderToString } from 'react-dom/server';
import { CustomLegendFormatter } from '../components/Highcharts/SolidGaugeChart';
import { CustomPieChartLegendFormatter } from '../components/Highcharts/CustomTooltipAndLabel';

export const DefaultTimeWindowValue = {
  timeWindowValue: 30,
  timeWindowUnit: { label: 'Minutes', value: 'minute' }
};

/*
This function converts the provided timeWindowValue and timeWindowUnit into seconds
and checks if it exceeds the maximum limit of 7 days (in seconds). If the unit is invalid, it returns false.
*/
const isValidTimeWindow = (timeWindowValue, timeWindowUnit) => {
  const maxLimitInSeconds = 7 * 24 * 60 * 60; // 7 days in seconds
  let timeInSeconds = 0;

  switch (timeWindowUnit) {
    case 'seconds':
      timeInSeconds = timeWindowValue;
      break;
    case 'minute':
      timeInSeconds = timeWindowValue * 60;
      break;
    case 'hour':
      timeInSeconds = timeWindowValue * 60 * 60;
      break;
    case 'day':
      timeInSeconds = timeWindowValue * 24 * 60 * 60;
      break;
    default:
      return false; // Invalid unit
  }

  return timeInSeconds <= maxLimitInSeconds;
};

export const addNewDashboardFormConfig = () => [
  {
    name: 'name',
    title: getTranslateMessage(dashboardMessages.dashboardName),
    isBasic: true,
    isRequired: true,
    componentType: 'INPUT',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.custDashNamePlaceholder),
    autoFocus: true,
    rules: {
      required: getTranslateMessage(dashboardMessages.customDashNameError),
      maxLength: {
        value: 45,
        message: getTranslateMessage(dashboardMessages.nameMaxLengthError)
      },
      message: getTranslateMessage(dashboardMessages.customDashNameError)
    },
    autoComplete: 'off'
  },
  {
    name: 'description',
    title: getTranslateMessage(dashboardMessages.customDashDescription),
    isBasic: true,
    isRequired: true,
    componentType: 'TEXTAREA',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.customDashDescriptionPlaceholder),
    rules: {
      maxLength: {
        value: 140,
        message: getTranslateMessage(dashboardMessages.descriptionMaxLengthError)
      }
    },
    autoComplete: 'off',
    rows: 3
  }
];

export const addNewPanelFormConfig = ({ panelTypeValue }) => [
  {
    name: 'panelType',
    title: getTranslateMessage(dashboardMessages.panelType),
    placeholder: getTranslateMessage(dashboardMessages.panelTypePlaceholder),
    componentType: 'ASYNC-SELECT',
    options: [],
    isRequired: true,
    isClearable: false,
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    withCustomComponents: true,
    endPoint: '/api/v1.0/analytics/bots/:botId/panels',
    responsePath: 'panels',
    rules: {
      required: getTranslateMessage(dashboardMessages.panelTypeErrMsg),
      message: getTranslateMessage(dashboardMessages.panelTypeErrMsg)
    }
  },
  {
    name: 'panelName',
    title: getTranslateMessage(dashboardMessages.panelName),
    isRequired: true,
    componentType: 'INPUT',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.panelNamePlaceholder),
    autoComplete: 'off',
    withCustomStyle: true,
    rules: {
      required: getTranslateMessage(dashboardMessages.panelNameErrMsg),
      maxLength: {
        value: 40,
        message: getTranslateMessage(dashboardMessages.panelNameMaxLengthErrMsg)
      },
      message: getTranslateMessage(dashboardMessages.panelNameErrMsg)
    }
  },

  {
    name: 'panelDescription',
    title: getTranslateMessage(dashboardMessages.panelDesc),
    isRequired: true,
    componentType: 'TEXTAREA',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.panelDescPlaceholder),
    withCustomStyle: true,
    rules: {
      maxLength: {
        value: 75,
        message: getTranslateMessage(dashboardMessages.panelDescMaxLengthErrMsg)
      }
    },
    autoComplete: 'off'
  },

  {
    name: 'Panel controls',
    title: getTranslateMessage(dashboardMessages.panelControls),
    componentType: 'HEADING',
    isDisabled: false,
    dependentOn: {
      name: 'panelType',
      valueIn: [
        'timeSeries',
        'barChart',
        'barChartCategorical',
        'columnChart',
        'columnChartCategorical',
        'pieChart',
        'number',
        'text',
        'table',
        'userJourney'
      ]
    }
  },

  //metric applicable for Funnle user journey
  {
    name: 'steps',
    title: 'Step',
    isRequired: true,
    componentType: 'fieldArray',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.panelNamePlaceholder),
    autoComplete: 'off',
    withCustomStyle: true,
    props: { addBlankRow: true },
    fields: [
      {
        name: 'metrics',
        title: 'Metrics',
        placeholder: getTranslateMessage(dashboardMessages.panelTypePlaceholder),
        componentType: 'NESTED_DROPDOWN',
        isRequired: true,
        isClearable: false,
        isDisabled: false,
        isMulti: false,
        withCustomStyle: true,
        withCustomComponents: true,
        options: [],
        endPoint: '/api/analytics/bots/:botId/user-journey/metrics',
        rules: {
          validate: (value, data) => {
            const steps = data?.steps || [];
            if (!steps?.some(step => !isEmpty(step?.metrics))) {
              return 'Please select at least one step';
            } else if (Array.isArray(steps) && steps.length > 0 && !value) {
              return 'Please select a metric';
            }
            return true;
          }
        }
      }
    ],
    dependentOn: {
      name: 'panelType',
      valueIn: ['userJourney']
    },
    limit: 5
  },

  //metric applicable for Funnle user journey
  {
    name: 'divider1',
    title: '',
    componentType: 'DIVIDER',
    dependentOn: {
      name: 'panelType',
      valueIn: ['userJourney']
    }
  },

  //visible when funnel journey chart type is selected
  {
    name: 'isOrdered',
    title: 'Strict order flow',
    isRequired: false,
    componentType: 'SWITCH',
    isDisabled: false,
    defaultValue: true,
    props: {
      variant: 'outlined'
    },
    dependentOn: {
      name: 'panelType',
      valueIn: ['userJourney']
    }
  },

  // field applicable for Funnel journey time window
  {
    name: 'timeWindowValue',
    title: 'Funnel journey time window',
    isRequired: false,
    componentType: 'INPUT-WITH-DROPDOWN',
    isDisabled: false,
    placeholder: '0',
    autoComplete: 'off',
    withCustomStyle: true,
    defaultValue: DefaultTimeWindowValue,
    props: { inputProps: { inputMode: 'numeric', pattern: '[0-9]*', min: 0 } },
    rules: {
      required: 'Please enter time window',
      message: 'Please enter time window',
      validate: (value, data) => {
        const { timeWindowValue, timeWindowUnit } = value;
        if (!timeWindowValue) {
          return 'Please enter time window';
        } else if (timeWindowValue && timeWindowUnit) {
          if (isValidTimeWindow(timeWindowValue, timeWindowUnit?.value)) {
            return true;
          } else {
            return 'Exceeds the max limit of 7 days';
          }
        }
        return true;
      }
    },
    helpText: 'Maximum time limit - 7 days',
    dependentOn: {
      name: 'isOrdered',
      valueIn: [true],
      parentDependentFld: { field: 'panelType', value: ['userJourney'] }
    },
    dropdownField: {
      name: 'timeWindowUnit',
      title: '',
      isRequired: true,
      placeholder: 'Please select time window unit',
      isClearable: false,
      componentType: 'SELECT',
      options: [
        { label: 'Seconds', value: 'seconds' },
        { label: 'Minutes', value: 'minute' },
        { label: 'Hour', value: 'hour' },
        { label: 'Day', value: 'day' }
      ],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true
    }
  },

  // Funnel view by applicable for Funnle user journey
  {
    name: 'funnelViewBy',
    title: 'Funnel view by',
    isRequired: true,
    placeholder: 'Funnel view by',
    isClearable: true,
    componentType: 'SELECT',
    defaultValue: {
      label: 'Interaction level',
      value: 'interaction'
    },
    options: [
      {
        label: 'User level',
        value: 'user'
      },
      {
        label: 'Interaction level',
        value: 'interaction'
      }
    ],
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['userJourney']
    },
    rules: {
      required: 'Please select funnel view type',
      message: 'Please select funnel view type'
    }
  },

  // Metric applicable for charts
  {
    name: 'metric',
    title: getTranslateMessage(dashboardMessages.metric),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
    isClearable: true,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: true,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['timeSeries', 'barChart', 'columnChart']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics',
    rules: {
      required: getTranslateMessage(dashboardMessages.metricErrMsg),
      message: getTranslateMessage(dashboardMessages.metricErrMsg)
    }
  },

  // Metric applicable for charts
  {
    name: 'metric',
    title: getTranslateMessage(dashboardMessages.metric),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
    isClearable: true,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['barChartCategorical', 'columnChartCategorical']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics',
    rules: {
      required: getTranslateMessage(dashboardMessages.metricErrMsg),
      message: getTranslateMessage(dashboardMessages.metricErrMsg)
    }
  },

  // Metric applicable for pie charts
  {
    name: 'metric',
    title: getTranslateMessage(dashboardMessages.metric),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
    isClearable: true,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['pieChart']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics',
    rules: {
      required: getTranslateMessage(dashboardMessages.metricErrMsg),
      message: getTranslateMessage(dashboardMessages.metricErrMsg)
    }
  },

  //Metric applicable for number/text panel
  {
    name: 'metric',
    title: getTranslateMessage(dashboardMessages.metric),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
    isClearable: true,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['number', 'text']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics',
    rules: {
      required: getTranslateMessage(dashboardMessages.metricErrMsg),
      message: getTranslateMessage(dashboardMessages.metricErrMsg)
    }
  },

  //Metric applicable for table panel
  {
    name: 'metric',
    title: getTranslateMessage(dashboardMessages.metric),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
    isClearable: true,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['table']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics',
    rules: {
      required: getTranslateMessage(dashboardMessages.metricErrMsg),
      message: getTranslateMessage(dashboardMessages.metricErrMsg)
    }
  },

  //Aplicable only for tabel panel

  {
    name: 'columnsName',
    title: getTranslateMessage(dashboardMessages.columnsName),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.columnsNamePlaceholder),
    isClearable: false,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: true,
    withCustomStyle: true,
    dependentOn: {
      name: 'metric',
      valueNin: ['', null, undefined],
      parentDependentFld: { field: 'panelType', value: ['table'] }
    },
    responsePath: 'columns',
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics/:metricId/headers',
    rules: {
      required: getTranslateMessage(dashboardMessages.columnsNameErrMsg),
      message: getTranslateMessage(dashboardMessages.columnsNameErrMsg)
    }
  },

  //Aplicable only for tabel panel groupby dropdown
  {
    name: 'tableGroupBy',
    title: getTranslateMessage(dashboardMessages.groupBy),
    isRequired: false,
    placeholder: getTranslateMessage(dashboardMessages.groupByPlaceholder),
    isClearable: true,
    componentType: 'ASYNC-SELECT',
    options: [],
    isDisabled: false,
    isMulti: true,
    withCustomStyle: true,
    responsePath: 'dropdown',
    dependentOn: {
      name: 'metric',
      valueContains: ['showGroupBy']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics/:metricId/headers'
  },

  //Aplicable only for pie panel

  {
    name: 'groupBy',
    title: getTranslateMessage(dashboardMessages.groupBy),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.groupByPlaceholder),
    isClearable: true,
    componentType: 'SELECT',
    options: [
      { label: 'Location Wise', value: 'location' },
      { label: 'Department Wise', value: 'department' }
    ],
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    dependentOn: {
      name: 'panelType',
      valueIn: ['barChartCategorical', 'pieChart', 'columnChartCategorical']
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/panels/:panelType/metrics/:metricId/headers'
  },

  {
    name: 'xAxisTitle',
    title: getTranslateMessage(dashboardMessages.xAxis),
    isRequired: true,
    componentType: 'INPUT',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.xAxisPlaceholder),
    withCustomStyle: true,
    autoComplete: 'off',
    defaultValue: panelTypeValue === ChartTypes.USER_JOURNEY ? 'Steps' : '',
    rules: {
      maxLength: {
        value: 30,
        message: getTranslateMessage(dashboardMessages.xAxisMaxLengthErrMsg)
      }
    },
    dependentOn: {
      name: 'panelType',
      valueIn: ['timeSeries', 'barChart', 'columnChart', 'userJourney']
    }
  },
  {
    name: 'yAxisTitle',
    title: getTranslateMessage(dashboardMessages.yAxis),
    isRequired: false,
    componentType: 'INPUT',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.yAxisPlaceholder),
    autoComplete: 'off',
    withCustomStyle: true,
    rules: {
      maxLength: {
        value: 30,
        message: getTranslateMessage(dashboardMessages.yAxisMaxLengthErrMsg)
      }
    },

    dependentOn: {
      name: 'panelType',
      valueIn: [
        'timeSeries',
        'barChart',
        'barChartCategorical',
        'columnChart',
        'columnChartCategorical'
      ]
    }
  },

  {
    name: 'isStacked',
    title: getTranslateMessage(dashboardMessages.enableStacking),
    isRequired: false,
    componentType: 'SWITCH',
    isDisabled: false,
    props: {
      variant: 'standard'
    },
    dependentOn: {
      name: 'panelType',
      valueIn: ['barChartCategorical', 'columnChartCategorical']
    }
  },

  {
    name: 'prefix',
    title: getTranslateMessage(dashboardMessages.prefix),
    isRequired: false,
    componentType: 'INPUT',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.prefixPlaceholder),
    autoComplete: 'off',
    withCustomStyle: true,
    rules: {
      maxLength: {
        value: 10,
        message: getTranslateMessage(dashboardMessages.prefixMaxLengthErrMsg)
      }
    },

    dependentOn: {
      name: 'panelType',
      valueIn: ['number', 'text']
    }
  },

  {
    name: 'suffix',
    title: getTranslateMessage(dashboardMessages.suffix),
    isRequired: false,
    componentType: 'INPUT',
    isDisabled: false,
    placeholder: getTranslateMessage(dashboardMessages.suffixPlaceholder),
    autoComplete: 'off',
    withCustomStyle: true,
    rules: {
      maxLength: {
        value: 10,
        message: getTranslateMessage(dashboardMessages.suffixMaxLengthErrMsg)
      }
    },
    dependentOn: {
      name: 'panelType',
      valueIn: ['number', 'text']
    }
  }
];

const panelSizeTypes = {
  card: 'card',
  halfScreen: 'halfScreen',
  fullScreen: 'fullScreen',
} as const;
type ChartTypeType = (typeof ChartTypes)[keyof typeof ChartTypes];
interface PanelTypeSizeMapValue {
  cardType: keyof typeof panelSizeTypes; // Matches keys from `panelSizeTypes`.
  chartType: ChartTypeType;             // Matches `ChartTypeType`.
}
const panelTypeSizeMap: Record<ChartTypeType, PanelTypeSizeMapValue> = {
  [ChartTypes.TIMESERIES]: { cardType: panelSizeTypes.fullScreen, chartType: ChartTypes.TIMESERIES },
  //delete this entry later
  [ChartTypes.BAR_CHART]: { cardType: panelSizeTypes.halfScreen, chartType: ChartTypes.BAR_CHART },
  [ChartTypes.BAR_CHART_CATRGORICAL]: { cardType: panelSizeTypes.halfScreen, chartType: ChartTypes.BAR_CHART_CATRGORICAL },
  //delete this entry later
  [ChartTypes.COLUMN_CHART]: { cardType: panelSizeTypes.halfScreen, chartType: ChartTypes.COLUMN_CHART_CATRGORICAL },
  [ChartTypes.COLUMN_CHART_CATRGORICAL]: { cardType: panelSizeTypes.halfScreen, chartType: ChartTypes.COLUMN_CHART_CATRGORICAL },
  [ChartTypes.USER_JOURNEY]: { cardType: panelSizeTypes.halfScreen, chartType: ChartTypes.USER_JOURNEY },
  [ChartTypes.PIE_CHART]: { cardType: panelSizeTypes.halfScreen, chartType: ChartTypes.PIE_CHART },
  [ChartTypes.NUMBER]: { cardType: panelSizeTypes.card, chartType: ChartTypes.NUMBER },
  [ChartTypes.TEXT]: { cardType: panelSizeTypes.card, chartType: ChartTypes.TEXT },
  //delete this entry later
  [ChartTypes.TABLE]: { cardType: panelSizeTypes.card, chartType: ChartTypes.TABLE },
};
// Define a reusable type for Position
type Position = {
  col: number;
  row: number;
  size_x: number;
  size_y: number;
};

// Define a reusable type for the panel state
type PanelState =
  | { position: any; canAdd: boolean; error: string }
  | { position: Position; canAdd: boolean; error?: undefined };

// Use the reusable types for availableSizes
type AvailableSizes = {
  card: PanelState;
  halfScreen: PanelState;
  fullScreen: PanelState;
};
export const addNewMetricFormConfig = ({ productValue, panelTypeValue, isEditing = false, availableSizes }: { productValue: string; panelTypeValue: string; isEditing: boolean; availableSizes: AvailableSizes }) => {
  // console.log({ productValue, panelTypeValue, isEditing, availableSizes })
  return [
    //product type
    {
      name: 'product',
      title: "Product",
      placeholder: "Select product",
      componentType: 'ASYNC-SELECT',
      options: [],
      isRequired: true,
      isClearable: false,
      isDisabled: isEditing,
      isMulti: false,
      withCustomStyle: true,
      withCustomComponents: true,
      endPoint: '/api/bots/:botId/report-dashboard/products',
      responsePath: 'result',
      rules: {
        required: "product is required.",
        message: "product is required."
      }
    },

    //panel type
    {
      name: 'panelType',
      title: getTranslateMessage(dashboardMessages.panelType),
      placeholder: getTranslateMessage(dashboardMessages.panelTypePlaceholder),
      componentType: 'ASYNC-SELECT',
      options: [],
      isRequired: true,
      isClearable: false,
      isDisabled: !productValue || isEditing,
      isMulti: false,
      withCustomStyle: true,
      withCustomComponents: true,
      endPoint: '/api/bots/:botId/report-dashboard/products/:product/panels',
      responsePath: 'panels',
      rules: {
        required: getTranslateMessage(dashboardMessages.panelTypeErrMsg),
        message: getTranslateMessage(dashboardMessages.panelTypeErrMsg)
      },
      tranformOption: (option: {
        label: string;
        value: ChartTypeType;
        iconProps?: {
          iconName?: string;
        };
      }) => {
        if (panelTypeSizeMap[option.value]) {
          const { cardType, chartType } = panelTypeSizeMap[option.value];
          const { canAdd } = availableSizes[cardType];
          return { ...option, disabled: !canAdd, tooltipText: 'This chart cannot fit within the available space' };
        }
        return option
      }
    },

    //panel name
    {
      name: 'panelName',
      title: getTranslateMessage(dashboardMessages.panelName),
      isRequired: true,
      componentType: 'INPUT',
      isDisabled: !productValue,
      placeholder: getTranslateMessage(dashboardMessages.panelNamePlaceholder),
      autoComplete: 'off',
      withCustomStyle: true,
      rules: {
        required: getTranslateMessage(dashboardMessages.panelNameErrMsg),
        maxLength: {
          value: 40,
          message: getTranslateMessage(dashboardMessages.panelNameMaxLengthErrMsg)
        },
        message: getTranslateMessage(dashboardMessages.panelNameErrMsg)
      }
    },

    //divider
    {
      name: 'divider1',
      title: '',
      componentType: 'DIVIDER',
      // dependentOn: {
      //   name: 'panelType',
      //   valueIn: ['userJourney']
      // }
    },
    //panel control heading
    {
      name: 'Panel controls',
      title: getTranslateMessage(dashboardMessages.panelControls),
      componentType: 'HEADING',
      isDisabled: false,
      dependentOn: {
        name: 'panelType',
        valueIn: [
          'timeSeries',
          'barChartCategorical',
          'pieChart',
          'number',
          'text',
          'solidguage',
          'userJourney'
        ]
      }
    },

    //metric applicable for Funnle user journey
    {
      name: 'steps',
      title: 'Step',
      isRequired: true,
      componentType: 'fieldArray',
      isDisabled: false,
      placeholder: getTranslateMessage(dashboardMessages.panelNamePlaceholder),
      autoComplete: 'off',
      withCustomStyle: true,
      props: { addBlankRow: true },
      fields: [
        {
          name: 'metrics',
          title: 'Metrics',
          placeholder: getTranslateMessage(dashboardMessages.panelTypePlaceholder),
          componentType: 'NESTED_DROPDOWN',
          isRequired: true,
          isClearable: false,
          isDisabled: false,
          isMulti: false,
          withCustomStyle: true,
          withCustomComponents: true,
          options: [],
          endPoint: '/api/analytics/bots/:botId/user-journey/metrics',
          rules: {
            validate: (value, data) => {
              const steps = data?.steps || [];
              if (!steps?.some(step => !isEmpty(step?.metrics))) {
                return 'Please select at least one step';
              } else if (Array.isArray(steps) && steps.length > 0 && !value) {
                return 'Please select a metric';
              }
              return true;
            }
          }
        }
      ],
      dependentOn: {
        name: 'panelType',
        valueIn: ['userJourney']
      },
      limit: 5
    },

    //metric applicable for Funnle user journey
    {
      name: 'divider1',
      title: '',
      componentType: 'DIVIDER',
      dependentOn: {
        name: 'panelType',
        valueIn: ['userJourney']
      }
    },

    //visible when funnel journey chart type is selected
    {
      name: 'isOrdered',
      title: 'Strict order flow',
      isRequired: false,
      componentType: 'SWITCH',
      isDisabled: false,
      defaultValue: true,
      props: {
        variant: 'outlined'
      },
      dependentOn: {
        name: 'panelType',
        valueIn: ['userJourney']
      }
    },

    // field applicable for Funnel journey time window
    {
      name: 'timeWindowValue',
      title: 'Funnel journey time window',
      isRequired: false,
      componentType: 'INPUT-WITH-DROPDOWN',
      isDisabled: false,
      placeholder: '0',
      autoComplete: 'off',
      withCustomStyle: true,
      defaultValue: DefaultTimeWindowValue,
      props: { inputProps: { inputMode: 'numeric', pattern: '[0-9]*', min: 0 } },
      rules: {
        required: 'Please enter time window',
        message: 'Please enter time window',
        validate: (value, data) => {
          const { timeWindowValue, timeWindowUnit } = value;
          if (!timeWindowValue) {
            return 'Please enter time window';
          } else if (timeWindowValue && timeWindowUnit) {
            if (isValidTimeWindow(timeWindowValue, timeWindowUnit?.value)) {
              return true;
            } else {
              return 'Exceeds the max limit of 7 days';
            }
          }
          return true;
        }
      },
      helpText: 'Maximum time limit - 7 days',
      dependentOn: {
        name: 'isOrdered',
        valueIn: [true],
        parentDependentFld: { field: 'panelType', value: ['userJourney'] }
      },
      dropdownField: {
        name: 'timeWindowUnit',
        title: '',
        isRequired: true,
        placeholder: 'Please select time window unit',
        isClearable: false,
        componentType: 'SELECT',
        options: [
          { label: 'Seconds', value: 'seconds' },
          { label: 'Minutes', value: 'minute' },
          { label: 'Hour', value: 'hour' },
          { label: 'Day', value: 'day' }
        ],
        isDisabled: false,
        isMulti: false,
        withCustomStyle: true
      }
    },

    // Funnel view by applicable for Funnle user journey
    {
      name: 'funnelViewBy',
      title: 'Funnel view by',
      isRequired: true,
      placeholder: 'Funnel view by',
      isClearable: true,
      componentType: 'SELECT',
      defaultValue: {
        label: 'Interaction level',
        value: 'interaction'
      },
      options: [
        {
          label: 'User level',
          value: 'user'
        },
        {
          label: 'Interaction level',
          value: 'interaction'
        }
      ],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true,
      dependentOn: {
        name: 'panelType',
        valueIn: ['userJourney']
      },
      rules: {
        required: 'Please select funnel view type',
        message: 'Please select funnel view type'
      }
    },

    // Metric applicable for timeSeries charts
    {
      name: 'metric',
      title: getTranslateMessage(dashboardMessages.metric),
      isRequired: true,
      placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
      isClearable: true,
      componentType: 'ASYNC-SELECT',
      options: [],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true,
      dependentOn: {
        name: 'panelType',
        valueIn: ['timeSeries']
      },
      endPoint: '/api/bots/:botId/report-dashboard/products/:product/panels/:panelType/metrics',
      rules: {
        required: getTranslateMessage(dashboardMessages.metricErrMsg),
        message: getTranslateMessage(dashboardMessages.metricErrMsg)
      }
    },

    // Metric applicable for guage charts
    {
      name: 'metric',
      title: getTranslateMessage(dashboardMessages.metric),
      isRequired: true,
      placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
      isClearable: true,
      componentType: 'ASYNC-SELECT',
      options: [],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true,
      dependentOn: {
        name: 'panelType',
        valueIn: ['solidgauge']
      },
      endPoint: '/api/bots/:botId/report-dashboard/products/:product/panels/:panelType/metrics',
      rules: {
        required: getTranslateMessage(dashboardMessages.metricErrMsg),
        message: getTranslateMessage(dashboardMessages.metricErrMsg)
      }
    },

    // Metric applicable for categorical charts
    {
      name: 'metric',
      title: getTranslateMessage(dashboardMessages.metric),
      isRequired: true,
      placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
      isClearable: true,
      componentType: 'ASYNC-SELECT',
      options: [],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true,
      dependentOn: {
        name: 'panelType',
        valueIn: ['barChartCategorical', 'columnChartCategorical']
      },
      endPoint: '/api/bots/:botId/report-dashboard/products/:product/panels/:panelType/metrics',
      rules: {
        required: getTranslateMessage(dashboardMessages.metricErrMsg),
        message: getTranslateMessage(dashboardMessages.metricErrMsg)
      }
    },

    // Metric applicable for pie charts
    {
      name: 'metric',
      title: getTranslateMessage(dashboardMessages.metric),
      isRequired: true,
      placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
      isClearable: true,
      componentType: 'ASYNC-SELECT',
      options: [],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true,
      dependentOn: {
        name: 'panelType',
        valueIn: ['pieChart']
      },
      endPoint: '/api/bots/:botId/report-dashboard/products/:product/panels/:panelType/metrics',
      rules: {
        required: getTranslateMessage(dashboardMessages.metricErrMsg),
        message: getTranslateMessage(dashboardMessages.metricErrMsg)
      }
    },

    //Metric applicable for number/text panel
    {
      name: 'metric',
      title: getTranslateMessage(dashboardMessages.metric),
      isRequired: true,
      placeholder: getTranslateMessage(dashboardMessages.metricPlaceholder),
      isClearable: true,
      componentType: 'ASYNC-SELECT',
      options: [],
      isDisabled: false,
      isMulti: false,
      withCustomStyle: true,
      dependentOn: {
        name: 'panelType',
        valueIn: ['number', 'text']
      },
      endPoint: '/api/bots/:botId/report-dashboard/products/:product/panels/:panelType/metrics',
      rules: {
        required: getTranslateMessage(dashboardMessages.metricErrMsg),
        message: getTranslateMessage(dashboardMessages.metricErrMsg)
      }
    },

    //x axis title
    {
      name: 'xAxisTitle',
      title: getTranslateMessage(dashboardMessages.xAxis),
      isRequired: true,
      componentType: 'INPUT',
      isDisabled: false,
      placeholder: getTranslateMessage(dashboardMessages.xAxisPlaceholder),
      withCustomStyle: true,
      autoComplete: 'off',
      defaultValue: panelTypeValue === ChartTypes.USER_JOURNEY ? 'Steps' : '',
      rules: {
        maxLength: {
          value: 30,
          message: getTranslateMessage(dashboardMessages.xAxisMaxLengthErrMsg)
        }
      },
      dependentOn: {
        name: 'panelType',
        valueIn: ['timeSeries', 'userJourney']
      }
    },

    //y axis title
    {
      name: 'yAxisTitle',
      title: getTranslateMessage(dashboardMessages.yAxis),
      isRequired: false,
      componentType: 'INPUT',
      isDisabled: false,
      placeholder: getTranslateMessage(dashboardMessages.yAxisPlaceholder),
      autoComplete: 'off',
      withCustomStyle: true,
      rules: {
        maxLength: {
          value: 30,
          message: getTranslateMessage(dashboardMessages.yAxisMaxLengthErrMsg)
        }
      },

      dependentOn: {
        name: 'panelType',
        valueIn: [
          'timeSeries',
          'barChartCategorical',
          'columnChartCategorical'
        ]
      }
    },

    //prefix
    {
      name: 'prefix',
      title: getTranslateMessage(dashboardMessages.prefix),
      isRequired: false,
      componentType: 'INPUT',
      isDisabled: false,
      placeholder: getTranslateMessage(dashboardMessages.prefixPlaceholder),
      autoComplete: 'off',
      withCustomStyle: true,
      rules: {
        maxLength: {
          value: 10,
          message: getTranslateMessage(dashboardMessages.prefixMaxLengthErrMsg)
        }
      },

      dependentOn: {
        name: 'panelType',
        valueIn: ['number', 'text']
      }
    },

    //suffix
    {
      name: 'suffix',
      title: getTranslateMessage(dashboardMessages.suffix),
      isRequired: false,
      componentType: 'INPUT',
      isDisabled: false,
      placeholder: getTranslateMessage(dashboardMessages.suffixPlaceholder),
      autoComplete: 'off',
      withCustomStyle: true,
      rules: {
        maxLength: {
          value: 10,
          message: getTranslateMessage(dashboardMessages.suffixMaxLengthErrMsg)
        }
      },
      dependentOn: {
        name: 'panelType',
        valueIn: ['number', 'text']
      }
    }
  ]
};


export const filtersConfig = () => [
  {
    name: 'filtersMetric',
    title: getTranslateMessage(dashboardMessages.filterMetric),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.filterMetricPlaceholder),
    isClearable: false,
    componentType: 'ASYNC-SELECT',
    options: [],
    showFilteredOptions: true,
    isDisabled: false,
    isMulti: false,
    withCustomStyle: true,
    endPoint: '/api/v1.0/analytics/bots/:botId/filter-keys'
  },
  {
    name: 'filtersAttributes',
    title: getTranslateMessage(dashboardMessages.filterAttributes),
    isRequired: true,
    placeholder: getTranslateMessage(dashboardMessages.filterAttributesPlaceholder),
    isClearable: false,
    componentType: 'ASYNC-SELECT',
    options: [],
    showFilteredOptions: true,
    isDisabled: false,
    isMulti: true,
    withCustomStyle: true,
    dependentOn: {
      name: 'filtersMetric'
    },
    endPoint: '/api/v1.0/analytics/bots/:botId/filter-keys/:key'
  }
];

const sizeMap = {
  card: {
    w: 6,
    h: 3,
    minW: 6,
    maxW: 9,
    minH: 3,
    maxH: 4
  },
  halfScreen: {
    w: 9,
    h: 6,
    minW: 9,
    maxW: 18,
    minH: 6,
    maxH: 8
  },
  fullScreen: {
    w: 18,
    h: 6,
    minW: 9,
    maxW: 18,
    minH: 6,
    maxH: 8
  },
  tableScreen: {
    w: 18,
    h: 9,
    minW: 18,
    maxW: 18,
    minH: 9,
    maxH: 11
  }
};

export const getSizePropertiesForPanel = chartType => {
  //ADD Min Max properties later here

  switch (chartType) {
    case ChartTypes.TIMESERIES:
      return sizeMap.fullScreen;

    case ChartTypes.TABLE:
      return sizeMap.tableScreen;

    case ChartTypes.BAR_CHART:
    case ChartTypes.BAR_CHART_CATRGORICAL:
    case ChartTypes.COLUMN_CHART:
    case ChartTypes.COLUMN_CHART_CATRGORICAL:
    case ChartTypes.USER_JOURNEY:
    case ChartTypes.PIE_CHART:
      return sizeMap.halfScreen;

    case ChartTypes.NUMBER:
    case ChartTypes.TEXT:
      return sizeMap.card;

    default:
      return sizeMap.card;
  }
};

export const reportPanelSizeMap = {
  card: {
    w: 6,
    h: 3,
    minW: 6,
    maxW: 9,
    minH: 3,
    maxH: 3
  },
  halfScreen: {
    w: 6,
    h: 6,
    minW: 6,
    maxW: 12,
    minH: 6,
    maxH: 9
  },
  fullScreen: {
    w: 12,
    h: 6,
    minW: 6,
    maxW: 12,
    minH: 6,
    maxH: 9
  }
};

export const getSizePropertiesForReportPanel = chartType => {
  //ADD Min Max properties later here

  switch (chartType) {
    case ChartTypes.TIMESERIES:
      return reportPanelSizeMap.fullScreen;

    case ChartTypes.BAR_CHART_CATRGORICAL:
    case ChartTypes.COLUMN_CHART_CATRGORICAL:
    case ChartTypes.USER_JOURNEY:
    case ChartTypes.PIE_CHART:
    case ChartTypes.GUAGE_CHART:
      return reportPanelSizeMap.halfScreen;

    case ChartTypes.NUMBER:
    case ChartTypes.TEXT:
      return reportPanelSizeMap.card;

    default:
      return reportPanelSizeMap.card;
  }
};

//profile.department.in
export const prepareFilters = ({ formFilters }) => {
  let transformedFilters = {};

  //[profile][dynamicVal][in] this strcuture has to be replaced later
  for (const filter of formFilters) {
    const { filtersMetric, filtersAttributes } = filter ?? {};
    //only add the filters to payload when attribute is selected else it makes unnecessary payload change which result in unncessary api calls in table
    if (filtersAttributes?.length > 0) {
      transformedFilters[
        `filters${filtersMetric?.value
          ?.split?.('.')
          ?.map?.(el => `[profile][${el}][in]`)
          ?.join?.('')
          ?.toLowerCase()}`
      ] = filtersAttributes?.map?.(attr => attr?.value);
    }
  }

  return transformedFilters;
};

export const prepareCardConfig = ({
  loading = true,
  formData = {},
  cardData = {},
  isInPanel = false,
  disableAction = false,
  ...rest
}) => {
  const { panelName, panelDescription, filters, prefix, suffix } = formData;

  return {
    loading,
    name: panelName,
    description: useClickableLinks(panelDescription),
    filters,
    cardData: cardData,
    disableAction: disableAction,
    prefix,
    suffix,
    isInPanel: isInPanel,
    ...rest
  };
};

const plotOptionsSeriesProperties: BaseChartProps['plotOptions']['series'] = {
  dataLabels: {
    enabled: true,
    style: {
      fontFamily: "Poppins",
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "16px",
      color: theme.palette['D-80']
    }
  },
  states: {
    hover: {
      enabled: false
    }
  },
}

export const commonChartPropertesForReportsChart: BaseChartProps = {
  tooltip: {
    enabled: false, // Disable tooltips globally
  },
}

//this util prepares the chart config specific to email report panels
export const getReportMetricChartConfig = ({ chartType, otherData }): BaseChartProps => {
  const { common } = otherData || {}
  const { isInPanel } = common || {}
  switch (chartType) {
    case ChartTypes.TIMESERIES: {
      return {
        ...commonChartPropertesForReportsChart,
        chart: {
          zoomType: null, // Disables zooming
          zooming: {
            type: null
          }
        },
        legend: {
          enabled: false, // Disable legends
        },
        plotOptions: {
          area: {
            fillOpacity: 0,
            turboThreshold: 50000,
            marker: {
              enabled: true,
              symbol: 'circle',
            },
            ...plotOptionsSeriesProperties
          },
        },
      }
    }

    case ChartTypes.PIE_CHART: {
      const { pie } = otherData || {}
      const { legendTitle } = pie || {}
      return {
        ...commonChartPropertesForReportsChart,
        legend: {
          itemMarginTop: 6,
          itemMarginBottom: 6,
          shared: true,
          useHTML: true,
          overflow: 'allow',
          labelFormatter() {
            return renderToString(
              <CustomPieChartLegendFormatter
                this={this}
                showPercentageInLegend={true}
              />
            );
          },
          ...(legendTitle
            ? {
              title: {
                text: renderToString(
                  <span
                    className="legendTitle"
                    style={{
                      fontWeight: 600,
                      color: theme.palette['D-80'],
                      marginLeft: theme.spacing(5),
                      ...theme.typography.bodyMedium
                    }}
                  >
                    {legendTitle}
                  </span>
                )
              }
            }
            : {
              title: {
                text: ''
              }
            })
        },
        plotOptions: {
          // center: ['50%', '52%'],
          // ...(!isInPanel ? {
          //   minSize: 160,
          //   size: 160,
          // } : {}),
          dataLabels: {
            connectorWidth: 0,
            distance: isInPanel ? -20 : -8,
            enabled: false,
            format: '{point.y}', // Show percentage
            style: {
              color: theme.palette['D-80'],
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "16px"
            },
          },
          showInLegend: true, // Show legend
        },
      };
    }

    case ChartTypes.BAR_CHART_CATRGORICAL: {
      return {
        ...commonChartPropertesForReportsChart,
        plotOptions: {
          series: {
            minPointLength: 10,
            ...plotOptionsSeriesProperties
          }
        },
      };
    }

    case ChartTypes.COLUMN_CHART_CATRGORICAL:
    case ChartTypes.USER_JOURNEY: {
      return {
        ...commonChartPropertesForReportsChart,
        plotOptions: {
          series: {
            minPointLength: 10,
            ...plotOptionsSeriesProperties
          },
          column: {
            minPointLength: 10,
            ...plotOptionsSeriesProperties
          }
        },
      };
    }

    case ChartTypes.GUAGE_CHART: {
      return {
        ...commonChartPropertesForReportsChart,
        legend: {
          enabled: false, // Hides the legend
        }
      };
    }
  }
  return {}
}

type PrepareChartConfigParams = {
  loading?: boolean;
  chartType?: string;
  formData?: IFormDefaultValue;
  chartData?: { [key: string]: string };
  showHighlightedTxt?: boolean;
  /**
 * used to prepare config for panels of custom and report dashboard.
 * if true we update the properties needed for report panels
 */
  isPartOfReportDashboard?: boolean;
  isInPanel?: boolean;
  handleCustomDrilldownClick?: (params: any) => void
}

export const prepareChartConfig = ({
  loading = true,
  chartType,
  formData = {},
  chartData = { yAxisLabel: '' },
  showHighlightedTxt = false,
  handleCustomDrilldownClick,
  isPartOfReportDashboard,
  isInPanel,
  ...rest
}: PrepareChartConfigParams) => {
  const { panelName, panelDescription, isStacked, xAxisTitle, yAxisTitle } = formData;

  let chartConfig: BaseChartProps = {
    title: showHighlightedTxt ? (
      <Typography variant="subHeadingSemiBold">
        {showHighlightedTxt ? highlightLabel(showHighlightedTxt, panelName) : panelName}
      </Typography>
    ) : (
      panelName
    ),
    subheader: useClickableLinks(panelDescription)
  };

  //common data nneded for updated the chart config for email report panels
  const otherDataForMetricChart = {
    common: {
      isInPanel
    },
    pie: {
      legendTitle: chartData?.legendTitle || ''
    }
  }

  const reportMetricChartConfig = isPartOfReportDashboard ? getReportMetricChartConfig({ chartType, otherData: otherDataForMetricChart }) : {}

  console.log({ reportMetricChartConfig, formData, chartData })

  switch (chartType) {
    case ChartTypes.TIMESERIES:
      chartConfig = {
        ...chartConfig,
        ...reportMetricChartConfig,
        ...transformer.transformData({ type: chartType, data: chartData }),
        ...(!!xAxisTitle ? { xAxis: { ...chartConfig?.xAxis, title: { text: xAxisTitle } } } : {}),
        ...(!!yAxisTitle ? { yAxis: { ...chartConfig?.yAxis, title: { text: yAxisTitle } } } : {}),
        formData
      };

      break;

    case ChartTypes.PIE_CHART: {
      const limitToClubPieDataIntoOthers = isPartOfReportDashboard ? 4 : 0
      return {
        ...chartConfig,
        ...transformer.transformDataToPieChart({ data: chartData, limitToClubPieDataIntoOthers }),
        ...reportMetricChartConfig,
        formData
      };
    }

    case ChartTypes.BAR_CHART:
      chartConfig = {
        ...chartConfig,
        ...transformer.transformData({ type: chartType, data: chartData }),
        ...(!!xAxisTitle ? { xAxis: { ...chartConfig?.xAxis, title: { text: xAxisTitle } } } : {}),
        ...(!!yAxisTitle ? { yAxis: { ...chartConfig?.yAxis, title: { text: yAxisTitle } } } : {}),
        plotOptions: {
          bar: { ...chartConfig?.plotOptions, stacking: isStacked ? 'normal' : undefined }
        },
        formData
      };
      break;

    case ChartTypes.BAR_CHART_CATRGORICAL:
      chartConfig = {
        ...chartConfig,
        ...reportMetricChartConfig,
        ...transformer.transformCategoricalData({ type: chartType, data: chartData }),
        ...(!!yAxisTitle ? { yAxis: { ...chartConfig?.yAxis, title: { text: yAxisTitle } } } : {}),
        plotOptions: {
          ...reportMetricChartConfig.plotOptions,
          bar: { ...chartConfig?.plotOptions, stacking: isStacked ? 'normal' : undefined },
        },
        formData
      };
      break;

    case ChartTypes.COLUMN_CHART:
      chartConfig = {
        ...chartConfig,
        ...transformer.transformData({ type: chartType, data: chartData }),
        ...(!!xAxisTitle ? { xAxis: { ...chartConfig?.xAxis, title: { text: xAxisTitle } } } : {}),
        ...(!!yAxisTitle ? { yAxis: { ...chartConfig?.yAxis, title: { text: yAxisTitle } } } : {}),
        plotOptions: {
          column: { ...chartConfig?.plotOptions, stacking: isStacked ? 'normal' : undefined }
        },
        formData
      };
      break;

    case ChartTypes.COLUMN_CHART_CATRGORICAL:
    case ChartTypes.USER_JOURNEY:
      chartConfig = {
        ...chartConfig,
        ...reportMetricChartConfig,
        ...transformer.transformCategoricalData({ type: chartType, data: chartData }),
        ...(xAxisTitle
          ? { xAxis: { ...chartConfig?.xAxis, title: { text: xAxisTitle } } }
          : { xAxis: { ...chartConfig?.xAxis, title: { text: null } } }),
        ...(!!(chartData?.yAxisLabel ?? yAxisTitle)
          ? {
            yAxis: {
              ...chartConfig?.yAxis,
              title: { text: chartData?.yAxisLabel ?? yAxisTitle ?? undefined }
            }
          }
          : {}),
        plotOptions: {
          ...reportMetricChartConfig.plotOptions,
          column: { ...chartConfig?.plotOptions, stacking: isStacked ? 'normal' : undefined }
        },
        formData
      };
      break;

    case ChartTypes.GUAGE_CHART: {
      const { infoValue } = chartData || {};
      const { numerator, denominator } = infoValue || {}
      return {
        ...chartConfig,
        formData,
        xAxis: {
          crosshair: false,
          ...reportMetricChartConfig.xAxis
        },

        yAxis: {
          showFirstLabel: false,
          showLastLabel: false,
          max: (denominator as number) ?? 0,
          labels: {
            y: 35,

            formatter: function () {
              if (typeof this.value === 'number') {
                return formatNumberWithDecimals(this.value) as string;
              } else {
                return this.value;
              }
            },

            style: {
              fontFamily: theme.typography.fontFamily,
              fontWeight: theme.typography.bodyMedium.fontWeight?.toString(),
              fontSize: theme.typography.bodyMedium.fontSize as string,
              letterSpacing: theme.typography.bodyMedium.letterSpacing,
              lineHeight: theme.typography.bodyMedium.lineHeight,
              color: theme.palette['D-50']
            }
          },
          ...reportMetricChartConfig.yAxis
        },

        pane: {
          center: ['50%', '65%'],
          ...reportMetricChartConfig.pane
        },

        legend: {
          useHTML: true,
          symbolPadding: 0,
          symbolWidth: 0,
          symbolHeight: 0,
          squareSymbol: false,

          labelFormatter: function () {
            return renderToString(
              <CustomLegendFormatter
                this={this}
                data={chartData}
                isSixOrLessThanSixColumnLayout={true}
              />
            );
          },

          itemStyle: {
            cursor: 'default'
          },
          itemHoverStyle: {
            color: 'inherit'
          },
          ...reportMetricChartConfig.legend
        },

        tooltip: {
          enabled: false,
          ...reportMetricChartConfig.tooltip
        },

        series: [
          {
            type: 'solidgauge',
            name: numerator as unknown as string,
            data: [numerator],

            dataLabels: {
              format:
                '<div style="text-align:center">' +
                '<span style="font-size:23px;font-weight:normal;line-height:28px;letter-spacing:0.25px">' +
                ((numerator / denominator) * 100)?.toFixed?.(2) +
                '%</span><br/>' +
                '</div>'
            },
            showInLegend: true,
            ...reportMetricChartConfig.series
          }
        ],
        ...reportMetricChartConfig
      };
    }

    default:
      break;
  }

  return { ...rest, ...chartConfig };
};

/*
  check if the user selected any column
  -if no -> return []
  -if yes -> filters the response column and return the columns
   1.that are selected by user
   2.if dynamic column
*/
export const prepareColumnConfig = ({
  tableDataLoading = false,
  userSelectedColumns = [],
  columnsFromResponse = [],
  isInPanel = false
}) => {
  try {
    if (tableDataLoading) {
      return new Array(6).fill(0).map((d, idx) => {
        return {
          key: idx,
          field: '',
          isVisible: true,
          label: '',
          width: 140
        };
      });
    }

    if (isEmpty(userSelectedColumns)) {
      return [];
    }

    const filteredColumns = columnsFromResponse?.reduce?.((acc, col) => {
      if (userSelectedColumns?.some(_col => _col?.value === col?.key) || col?.isDynamicColumn) {
        acc.push({
          ...col,
          ...(!isInPanel ? { sortable: true } : { sortable: false })
        });
      }
      return acc;
    }, []);

    return filteredColumns;
  } catch (error) {
    console.error('error occured while filtering columns : ', error);
    return [];
  }
};

export const prepareTableConfig = ({
  loading = true,
  dateRange = {},
  formData = {},
  chartData = {},
  isInPanel = false,
  disableAction = false,
  searchParams = {},
  ...rest
}) => {
  const { panelType, panelName, panelDescription, metric, columnsName, filters, tableGroupBy } =
    formData;

  let panelsPayload = {
    ...dateRange?.value,
    panelType: panelType?.value,
    metricId: Array.isArray(metric) ? metric?.map?.(options => options?.value) : metric?.value,
    isCustomMetric: true,
    timezone: getTimeZoneValues().timeZone
  };
  if (!isEmpty(filters)) {
    panelsPayload = { ...panelsPayload, ...prepareFilters({ formFilters: filters }) };
  } else {
    panelsPayload = { ...panelsPayload, ...searchParams };
  }

  //prepare the ne columns based on the column selected by user and column from response
  //as columns are dynamic now
  const colsToAllow = prepareColumnConfig({
    userSelectedColumns: columnsName,
    columnsFromResponse: chartData?.columns,
    isInPanel
  });

  return {
    name: panelName,
    description: useClickableLinks(panelDescription),
    filters,
    columns: colsToAllow ?? [],
    disableActions: disableAction,
    isInPanel: isInPanel,
    users: chartData?.tableData ?? [],
    pagination: {
      limit: chartData?.limit ?? 10,
      current: chartData?.current ?? 1,
      currentPage: chartData?.current ?? 1,
      totalCount: chartData?.total ?? 10,
      filterTotal: chartData?.total ?? 10
    },
    panelsPayload,
    tableGroupBy,
    userSelectedColumns: columnsName,
    ...rest
  };
};

export const getChartActionsConfig = ({
  filters,
  groupBy,
  isInfullScreen = false,
  isEditable = false,
  handleFullScreen,
  handleEditPanel,
  handleOpenDeleteAlert
}: ChartActionsConfigProps) => {
  const getFilters = () => {
    const totalFiltersApplied = getAppliedFiltersCount({ filters, groupBy })
    if ((!isEmpty(filters) && !isEmpty(filters?.[0]?.filtersAttributes)) || !isEmpty(groupBy)) {
      return [
        {
          key: 'FILTER_AND_GROUPBY',
          component: (
            <AppliedFiltersTooltip
              key="chart-action-filters"
              arrow={false}
              enterDelay={100}
              enterNextDelay={0}
              placement="bottom-start"
              title={<Title filters={filters} groupBy={groupBy} key="filter-tooltip-title" />}
            >
              <Box>
                <StyledAppliedFiltersChip totalFiltersApplied={totalFiltersApplied} />
              </Box>
            </AppliedFiltersTooltip>
          )
        }
      ];
    }
    return [];
  };

  const actionFilter = getFilters();

  const expandIcon = !isEditable
    ? [
      {
        key: 'EXPAND_PANEL',
        component: (
          <IconState
            iconName="ArrowsOutSimple"
            onClick={handleFullScreen}
            size={16}
            title={getTranslateMessage(dashboardMessages.fullscreen)}
          />
        )
      }
    ]
    : [];

  const editDeleteActions = isEditable
    ? [
      {
        key: 'EDIT_PANEL',
        component: (
          <IconState
            iconName="PencilSimple"
            onClick={handleEditPanel}
            size={16}
            title={getTranslateMessage(dashboardMessages.edit)}
          />
        )
      },
      {
        key: 'DELETE_PANEL',
        component: (
          <IconState
            iconName="Trash"
            onClick={handleOpenDeleteAlert}
            size={16}
            title={getTranslateMessage(dashboardMessages.remove)}
          />
        )
      }
    ]
    : [];

  const threeDotMenuSettingAndIcons = !isEditable
    ? [
      {
        key: 'THREE_DOT_MENU',
        itemProps: {
          threeDotsMenuConfig: {
            options: [
              { key: 'DOWNLOAD_AS_PNG' },
              { key: 'DOWNLOAD_AS_PDF' },
              { key: 'DOWNLOAD_AS_CSV' }
            ]
          }
        }
      }
    ]
    : [];

  if (isInfullScreen) {
    return [...actionFilter, ...editDeleteActions, ...threeDotMenuSettingAndIcons];
  } else {
    return [...actionFilter, ...expandIcon, ...editDeleteActions, ...threeDotMenuSettingAndIcons];
  }
};

export const getAppliedFiltersCount = ({ filters, groupBy }: Partial<ChartActionsConfigProps>) => {
  const filtersCount = !isEmpty(filters) && Array.isArray(filters) ? filters.reduce((count, filter) => {
    if (!isEmpty(filter?.filtersAttributes)) {
      count++
    }
    return count
  }, 0) : 0
  const groupByCount = !isEmpty(groupBy) ? 1 : 0
  return filtersCount + groupByCount
}

export const getReportChartsActionConfig = ({
  filters,
  groupBy,
  isEditable = false,
  handleEditPanel,
  handleOpenDeleteAlert
}: ChartActionsConfigProps) => {
  //show filters and group by only when panel is being edited
  if (!isEditable) {
    return []
  }
  const getFilters = () => {
    const totalFiltersApplied = getAppliedFiltersCount({ filters, groupBy })
    if ((!isEmpty(filters) && !isEmpty(filters?.[0]?.filtersAttributes)) || !isEmpty(groupBy)) {
      return [
        {
          key: 'FILTER_AND_GROUPBY',
          component: (
            <AppliedFiltersTooltip
              key="chart-action-filters"
              arrow={false}
              enterDelay={100}
              enterNextDelay={0}
              placement="bottom-start"
              title={<Title filters={filters} groupBy={groupBy} key="filter-tooltip-title" />}
            >
              <Box>
                <StyledAppliedFiltersChip totalFiltersApplied={totalFiltersApplied} />
              </Box>
            </AppliedFiltersTooltip>
          )
        }
      ];
    }
    return [];
  };

  const actionFilter = getFilters();

  const editDeleteActions = isEditable
    ? [
      {
        key: 'EDIT_PANEL',
        component: (
          <IconState
            iconName="PencilSimple"
            onClick={handleEditPanel}
            size={16}
            title={getTranslateMessage(dashboardMessages.edit)}
          />
        )
      },
      {
        key: 'DELETE_PANEL',
        component: (
          <IconState
            iconName="Trash"
            onClick={handleOpenDeleteAlert}
            size={16}
            title={getTranslateMessage(dashboardMessages.remove)}
          />
        )
      }
    ]
    : [];

  return [...actionFilter, ...editDeleteActions];
};

//return the date range in the format of {to:string,from:string} from the selected option of date range picker
export const getDateRangeFromSelectedOption = ({
  selectedOption,
  liveDate
}: {
  selectedOption: IStoreState['dateRange']['option'];
  liveDate: string;
}) => {
  let dateRange = { to: '', from: '' };
  //this is when you select custom range
  if (selectedOption.id === 5) {
    const [from, to] = selectedOption.value;
    dateRange.from = from;
    dateRange.to = to;
  } else {
    //this is when you select other options like last 7days or last 30days
    dateRange = DateUtils.getLastFilterTimeStamps(selectedOption?.value, liveDate);
  }

  return dateRange;
};

export const checkAnyPropertyWithTrueValue = (obj, propertyNames) => {
  for (let propName of propertyNames) {
    if (obj[propName] === true) {
      return true; // Property with value true exists in object
    }
  }
  return false; // No property with value true found in object
};

export const shouldRenderField = ({ w, dependentField, dependentValue }) => {
  //if field is dependent on some other field then check if it can be shown
  if (dependentField) {
    const dependentValueType = typeof dependentValue;
    if (
      (w[dependentField?.name as never] &&
        dependentField?.valueIn &&
        dependentField?.valueIn?.some?.(
          el =>
            el ===
            (dependentValueType === DATA_TYPES.OBJECT ? dependentValue?.value : dependentValue)
        )) ||
      (w[dependentField?.name] &&
        dependentField?.valueNin &&
        dependentField?.valueNin?.some?.(el => el === dependentValue?.value) === false &&
        w[dependentField?.parentDependentFld?.field] &&
        dependentField?.parentDependentFld?.value?.some?.(
          el => el === w[dependentField?.parentDependentFld?.field]?.value
        )) ||
      (w[dependentField?.name as never] &&
        dependentField?.valueContains &&
        checkAnyPropertyWithTrueValue(w[dependentField.name], dependentField?.valueContains))
    ) {
      return true;
    } else {
      return false;
    }
  }
  //if field is not dependent on any field then show it
  return true;
};

export const checkIfAllFieldsHaveValueForUserJourney = ({
  steps,
  isOrdered,
  funnelViewBy,
  timeWindowValue: formTimeWindowValue
}: Partial<IFormDefaultValue>) => {
  const isStepSelected = steps?.some?.(step => {
    const { metrics } = step || {};
    const { selectedOptions } = metrics || {};
    return !isEmpty(selectedOptions);
  });

  let timeWindowValue = !isEmpty(formTimeWindowValue)
    ? formTimeWindowValue
    : DefaultTimeWindowValue;

  if (isOrdered) {
    return (
      !isEmpty(steps) &&
      funnelViewBy?.value &&
      timeWindowValue?.timeWindowValue &&
      isValidTimeWindow(timeWindowValue?.timeWindowValue, timeWindowValue?.timeWindowUnit?.value)
    );
  }
  return !isEmpty(steps) && funnelViewBy?.value;
};

//get the payload for user journey panels
export const prepareUserJourneyDataPayload = ({ formData }: { formData: IFormDefaultValue }) => {
  const { steps, timeWindowValue: formTimeWindowValue, funnelViewBy, isOrdered } = formData ?? {};
  let timeWindowValue = !isEmpty(formTimeWindowValue)
    ? formTimeWindowValue
    : DefaultTimeWindowValue;
  try {
    return {
      journey: {
        ...(isOrdered
          ? {
            timeWindowValue: timeWindowValue?.timeWindowValue || 0,
            timeWindowUnit: timeWindowValue?.timeWindowUnit?.value
          }
          : {}),
        viewBy: funnelViewBy?.value,
        isOrdered: isOrdered || false,
        steps: steps
          ?.filter(step => {
            return !isEmpty(step?.metrics);
          })
          ?.map(step => {
            const { metrics } = step || {};
            const { selectedOptions } = metrics || {};

            if (Array.isArray(selectedOptions) && selectedOptions.length === 1) {
              return {
                name: selectedOptions?.[0]?.label,
                metric: {
                  metricId: selectedOptions?.[0]?.value,
                  vars: selectedOptions?.[0]?.vars ?? undefined
                }
              };
            } else {
              return {
                name: selectedOptions?.map(el => el.label),
                metric: {
                  metricId: selectedOptions?.map(el => el.value),
                  vars: selectedOptions?.map(el => el.vars)
                }
              };
            }
          })
      }
    };
  } catch (error) {
    console.error('error while building user journey payload : ', error);
    return {};
  }
};

export const panelGuideUserJourneyTexts = [
  { title: 'Funnel Steps', description: 'Define each step of the funnel.' },
  {
    title: 'Strict order flow',
    description:
      'Users can define whether they want to execute the funnel strictly in the order in which it is mentioned or it can be executed in any random order.'
  },
  {
    title: 'Funnel journey time window',
    description: 'Time that it took to perform all the steps of the funnel by the user.'
  },
  {
    title: 'Funnel view By',
    description:
      'Users can define whether they want to see the funnel at the user level or the interaction level. '
  }
];


const isDependentFieldValueExists = (dependentFieldValue: any) => {
	if (
		typeof dependentFieldValue === 'object' &&
		dependentFieldValue !== null &&
		isEmpty(dependentFieldValue)
	) {
		return false;
	}
	return true;
};

export const dependsOnAbsoluteValue = (
	dependency: condition | undefined,
	getValues: UseFormGetValues<Record<string, string>>
): boolean => {
	const dependencyName = getValues(dependency?.name ?? '');
	const dependentFieldValue = dependencyName?.value ?? dependencyName;

	if (
		dependency?.hasValue &&
		dependentFieldValue &&
		isDependentFieldValueExists(dependentFieldValue)
	) {
		return true;
	}

	const depsBool = !!(
		(dependentFieldValue !== undefined &&
			dependency?.value === dependentFieldValue) ||
		dependency?.valueIn?.includes(dependentFieldValue) ||
		dependency?.valueNin?.indexOf(dependentFieldValue) === -1 ||
		(dependency?.valueGt && dependency?.valueGt < +dependentFieldValue) ||
		(dependency?.valueLt && dependency?.valueLt > +dependentFieldValue)
	);
	return depsBool;
};

export const dependsOnAnotherField = (
	dependency: condition | undefined,
	getValues: UseFormGetValues<Record<string, string>>
) => {
	// @ts-ignore
	const { field1, field2, condition } = dependency;
	let [firstValue, secondValue] = getValues([field1, field2]);
	// @ts-ignore
	firstValue = firstValue?.value ?? firstValue;
	// @ts-ignore
	secondValue = secondValue?.value ?? secondValue;

	const num1 = Number(firstValue);
	const num2 = Number(secondValue);
	const areNumbers = !isNaN(num1) && !isNaN(num2);

	if (areNumbers) {
		switch (condition) {
			case 'equals':
				return num1 === num2;
			case 'greater':
				return num1 > num2;
			case 'lesser':
				return num1 < num2;
			case 'unequal':
				return num1 !== num2;
		}
	}

	const isDate = dayjs(firstValue).isValid() && dayjs(secondValue).isValid();
	//Separate comparison for dates
	//Dayjs objects inbuilt comparison methods are used here
	if (isDate && !areNumbers) {
		if (!firstValue || !secondValue) return false;
		const firstDate = dayjs(firstValue);
		const secondDate = dayjs(secondValue);

		switch (condition) {
			case 'equal':
				return firstDate.isSame(secondDate, 'day');
			case 'greater':
				return firstDate.isAfter(secondDate, 'day');
			case 'lesser':
				return firstDate.isBefore(secondDate, 'day');
			case 'unequal':
				return !firstDate.isSame(secondDate, 'day');
		}
	} else {
		if (isEmpty(firstValue) && isEmpty(secondValue)) return false;
		switch (condition) {
			case 'equal':
				return firstValue === secondValue;
			case 'greater':
				return firstValue > secondValue;
			case 'lesser':
				return firstValue < secondValue;
			case 'unequal':
				return firstValue !== secondValue;
		}
	}
};

export function shouldRenderField<T extends FieldValues>(
	dependency: DepedencyTypes | undefined,
	getValues: UseFormGetValues<T>,
	mContext: Record<string, unknown>
) {
	if (!isEmpty(dependency))
		return dependency?.every((dep: condition) => {
			// @ts-ignore
			if (dep.checkField) {
				if (dep?.valueIn.includes(mContext?.[dep?.name]?.type)) {
					return true;
				}
				return false;
			}
			// @ts-ignore
			if (dep?.name) {
				return dependsOnAbsoluteValue(dep, getValues);
			}
			// @ts-ignore
			if (dep?.field1) {
				return dependsOnAnotherField(dep, getValues);
			}
		});
	return true;
}
