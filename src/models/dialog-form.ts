export interface DialogData {
  email: string;
  firstFieldValue?: string;
  secondFieldValue?: string;
  speaking?: boolean | null | undefined;
  attending?: boolean | null | undefined;
  sponsoring?: boolean | null | undefined;
  exhibiting?: boolean | null | undefined;
  volunteering?: boolean | null | undefined;
}

export interface DialogForm {
  firstFieldLabel: string;
  firstFieldValue?: string;
  secondFieldLabel: string;
  secondFieldValue?: string;
  speaking?: boolean;
  attending?: boolean;
  sponsoring?: boolean;
  exhibiting?: boolean;
  volunteering?: boolean;
  submitLabel: string;
  title: string;
  submit: (data: DialogData) => void;
}
