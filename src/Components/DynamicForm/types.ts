import {
    FieldArrayWithId,
    UseFieldArrayRemove,
    UseFormReturn,
    ControllerFieldState
  } from 'react-hook-form';
  
  import { IStoreState } from 'containers/AnalyticsDashboard/types';
  
  type TRules = {
    required?: string;
    message?: string;
  };
  
  type TValueIn = string | number;
  
  export interface IFormField {
    name: string;
    key?: string;
    title?: string;
    placeholder?: string;
    componentType: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    autoFocus?: boolean;
    isMulti?: boolean;
    withCustomStyle?: boolean;
    withCustomComponents?: boolean;
    options?: TOption[];
    showFilteredOptions?: boolean;
    dependentOn?: {
      name?: string;
      valueIn?: TValueIn[];
      parentDependentFld?: { field?: string; value?: string[] };
    };
    endPoint?: string;
    autoComplete?: string;
    rules?: TRules;
    helpText?: string;
    rows?: number;
  }
  type TOption = {
    label?: string;
    value?: (typeof ChartTypes)[keyof typeof ChartTypes];
    type?: string | number;
  };
  
  type TSingleFilter = {
    filtersMetric?: TOption | null;
    filtersAttributes?: TOption[] | null;
  };
  
  type TStepMetrics = {
    defaultValue?: [
      {
        path?: Array<string | number>;
        value?: string | number;
      }
    ];
    selectedOptions: Array<{
      label: string;
      value: string;
      vars?: Record<string, string | boolean | number>;
    }>;
  };
  
  type TSteps = Array<{
    metrics?: TStepMetrics;
    [key: string]: any;
  }>;
  export interface IFormDefaultValue {
    product: TOption;
    panelType: TOption;
    panelName: string;
    panelDescription?: string;
    metric: TOption | TOption[] | null;
    groupBy?: TOption;
    isStacked?: boolean;
    columnsName?: TOption[];
    xAxisTitle?: string;
    yAxisTitle?: string;
    prefix?: string;
    suffix?: string;
    filters?: TSingleFilter[];
    steps?: TSteps;
    timeWindowValue?: {
      timeWindowValue?: number;
      timeWindowUnit?: TOption;
    };
    funnelViewBy?: TOption;
    isOrdered?: boolean;
  }
  
  export interface IPanelInfo {
    panelId?: string;
    i?: string;
    id?: string;
    w?: string | number;
    h?: string | number;
    minW?: string | number;
    maxW?: string | number;
    minH?: string | number;
    maxH?: string | number;
    size_x?: string | number;
    size_y?: string | number;
    col?: string | number;
    row?: string | number;
    name?: string;
    description?: string;
    cardType?: string;
    formData?: IFormDefaultValue;
    searchParams?: object;
    justAdded?: boolean;
    customClassName?: string;
    showHighlightedTxt?: string;
  }
  
  export interface IPanelEditorProps {
    closeDialog: () => void;
    editPanelFormConfig: {
      isVisible: boolean;
      panel?: IPanelInfo;
    };
  }
  
  export interface IPanelInfoProps {
    closeDialog?: () => void;
    chartData: { series?: any; data?: object };
    dateRange?: IStoreState['dateRange'];
    loading: boolean;
    errors?: object;
    editPanelFormConfig?: {
      isVisible: boolean;
      panel?: IPanelInfo;
    };
    panelTypeChanged?: boolean;
  }
  
  export interface IPanelEditorFilterProps {
    fields?: FieldArrayWithId<IFormDefaultValue, 'filters', 'id'>[];
    remove?: UseFieldArrayRemove;
    onFieldChange?: (name, {}, e) => void;
    scrollToBottom?: () => void;
    append?: (filter: TSingleFilter) => void;
  }
  
  export interface IChartRendererProps {
    chartType?: (typeof ChartTypes)[keyof typeof ChartTypes];
    loading?: boolean;
    formData?: IFormDefaultValue;
    chartData?: { series?: any; data?: object } | { [key: string]: string };
    dateRange?: IStoreState['dateRange'];
    /**
     * used to prepare config for panels of custom and report dashboard.
     * if true we update the properties needed for report panels
     */
    isPartOfReportDashboard?: boolean;
  }
  
  export interface IFieldMapperProps {
    name?: string;
    value?: string | number | undefined | null;
    formData?: IFormDefaultValue;
    formField?: IFormField;
    onChange?: (e) => void;
    onBlur?: (e) => void;
    filterIndex?: number;
    error?: string;
    fields?: [];
    title?: string;
    fieldState: ControllerFieldState;
  }
  
  export const ChartTypes = {
    TIMESERIES: 'timeSeries',
    BAR_CHART: 'barChart',
    BAR_CHART_CATRGORICAL: 'barChartCategorical',
    COLUMN_CHART: 'columnChart',
    PIE_CHART: 'pieChart',
    COLUMN_CHART_CATRGORICAL: 'columnChartCategorical',
    NUMBER: 'number',
    TEXT: 'text',
    TABLE: 'table',
    USER_JOURNEY: 'userJourney',
    GUAGE_CHART: 'solidguage'
  } as const;
  
  export interface FormFiled {
    name: string;
    title: string;
    isBasic?: boolean;
    isRequired?: boolean;
    componentType: string;
    isDisabled?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    addBlankRow?: boolean;
    fields?: Array<FormFiled>;
    options?: Array<{
      label: string;
      value: string;
      iconProps?: object;
    }>;
    rules?: {
      required?: string;
      maxLength?: {
        value: number;
        message: string;
      };
      minLength?: {
        value: number;
        message: string;
      };
      message: string;
    };
    dependentOn?: {
      name?: string;
      valueIn?: Array<string>;
    };
    autoComplete?: string;
    limit?: number;
    defaultValue?: any;
    props?: {
      addBlankRow?: boolean;
      variant?: string;
      [key: string]: any;
    };
    dropdownField?: FormFiled;
  }
  
  export interface FieldArrayProps {
    formField: FormFiled;
    onFieldChange: (fieldKey: string, formField: any, event: any) => void;
    formMethods: UseFormReturn<IFormDefaultValue, any>;
  }
  
  export enum Fieldkeys {
    product = 'product',
    panelType = 'panelType',
    metric = 'metric',
    funnelViewBy = 'funnelViewBy',
    timeWindowValue = 'timeWindowValue',
    isOrdered = 'isOrdered',
    steps = 'steps',
    filtersMetric = 'filtersMetric',
    filtersAttributes = 'filtersAttributes',
    groupBy = 'groupBy'
  }
  