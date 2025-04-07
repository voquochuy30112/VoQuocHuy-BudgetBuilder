export interface BudgetSubCategory {
  name: string;
  uuid: string;
  datas: number[];
}

export interface BudgetCategories {
  name: string;
  uuid: string;
  subcategories: BudgetSubCategory[];
}

export interface ToApply {
  type: string | null;
  value: number;
}
