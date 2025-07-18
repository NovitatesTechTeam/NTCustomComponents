import { PConnect } from "@pega/pcore-pconnect-typedefs";
import type { FieldValueList, FieldValueProps } from "@pega/cosmos-react-core";

// PConnProps.d.ts
// This gives us a place to have each component (which is most DX Components) that is
//  expected to have a getPConnect extend its props (from BaseProps)
//  such that every component will be expected to have a getPConnect() function
//  that returns a PConnect object. (new/better way of doing .propTypes).
//  This PConnProps can be extended to include other props that we know are in every component
export interface PConnProps {
  // getPConnect should exist for every C11n component. (add @ts-ignore in special cases where it isn't)
  getPConnect: () => typeof PConnect;

  // Allow any/all other key/value pairs in the BaseProps for now
  //  TODO: refine which other props are always expected for various component
  //    types and consider further interface "subclassing". For example, we may
  //    want to create a "BasePropsForm" that gives guidance on required, readonly, etc.
  //    and any other props that every Form component expects.
  //    For example, see the PConnFieldProps below.
  // NOTE: if you uncomment the line below, the PConnProps type will allow
  //  otherwise undefined types to appear. This can be helpful for debugging
  //  or when adding new components whose types aren't yet known.
  // [key: string]: any;
}

// PConnFieldProps extends PConnProps to bring in the common properties that are
// associated with most field components (ex: Dropdown, TextInput, etc.) in the
//  components/field directory
export interface PegaApplication {
  description: string;
  ID: string;
  name: string;
  pxObjClass: string;
  version: string;
}

export interface PConnFieldProps extends FieldValueProps {
  // Base props from Constellation
  getPConnect?: any;
  label?: string;
  value?: string | number;
  validatemessage?: string;
  hideLabel?: boolean;
  readOnly?: boolean;
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  helperText?: string;
  fieldMetadata?: any;
  // Additional props for applications
  onApplicationChange?: (appId: string) => void;
  selectedApplication?: string;
  applications?: PegaApplication[];
}
