import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { BudgetCategories, ToApply } from '../models/budget.interface';

@Component({
  selector: 'app-budget-detail',
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.scss',
})
export class BudgetDetailComponent implements OnInit {
  @ViewChildren('cellInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  incomeCategories = signal<BudgetCategories[]>([]);
  expenseCategories = signal<BudgetCategories[]>([]);
  startMonth = signal<string>('01');
  endMonth = signal<string>('12');

  // Apply to all
  isContextMenuVisible = false;
  contextMenuPosition: { top: number; left: number } | null = null;
  selectedRowIndex: number  = 0;
  selectedColIndex: number  = 0;
  valueToApply = signal<ToApply>({ type: null, value: 0 });

  constructor() {}

  ngOnInit() {}

  getMonthName(month: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month - 1];
  }

  getMonths(): string[] {
    if (parseInt(this.endMonth(), 10) < parseInt(this.startMonth(), 10))
      return [];
    const start = parseInt(this.startMonth(), 10);
    const end = parseInt(this.endMonth(), 10);
    const months = [];
    for (let i = start; i <= end; i++) {
      months.push(`${this.getMonthName(i)} 2024`);
    }
    return months;
  }

  updateStartMonth(value: string) {
    if (!value) return;
    const month = parseInt(value, 10);
    if (month >= 1 && month <= 12) {
      this.startMonth.set(value.padStart(2, '0'));
    }
  }

  updateEndMonth(value: string) {
    if (!value) return;
    const month = parseInt(value, 10);
    if (month >= 1 && month <= 12) {
      this.endMonth.set(value.padStart(2, '0'));
    }
  }

  calculateSubTotal(categories: BudgetCategories, monthIndex: number) {
    return categories.subcategories.reduce(
      (acc, item) => acc + (item.datas[monthIndex] || 0),
      0
    );
  }

  calculateColumnTotal(
    categories: BudgetCategories[],
    columnIndex: number
  ) {
    return categories.reduce((acc, folder) => {
      return (
        acc +
        folder.subcategories.reduce(
          (itemAcc, item) => itemAcc + (item.datas[columnIndex] || 0),
          0
        )
      );
    }, 0);
  }

  onAddcategory(categories: BudgetCategories[]) {
    if (categories.find((_item) => !_item.name)) return;
    const newCategory = {
      name: '',
      uuid: Math.random().toString(36).substring(2, 10),
      subcategories: [],
    };
    categories.push(newCategory);
    setTimeout(() => {
      const inputElement = document.getElementById(newCategory.uuid);
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }

  onAddSubcategory(categories: BudgetCategories) {
    if (categories.subcategories.find((_item) => !_item.name)) return;
    const newItem = {
      name: '',
      uuid: Math.random().toString(36).substring(2, 10),
      datas: Array(this.getMonths().length).fill(''),
    };
    categories.subcategories.push(newItem);
    setTimeout(() => {
      const inputElement = document.getElementById(newItem.uuid);
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }

  onDeleteItem(categories: BudgetCategories, index: number) {
    categories.subcategories.splice(index, 1);
  }

  onDeleteFolder(categories: BudgetCategories[], index: number) {
    categories.splice(index, 1);
  }

  isValidBtnAdd(categories: BudgetCategories[]) {
    return categories.every((_item) => _item.name.trim() !== '');
  }

  isValidBtnSubAdd(categories: BudgetCategories) {
    return categories.subcategories.every((_item) => _item.name.trim() !== '');
  }

  calculateProfitLoss(monthIndex: number) {
    const totalIncome = this.incomeCategories().reduce(
      (acc, categories) =>
        acc +
        categories.subcategories.reduce(
          (itemAcc, item) => itemAcc + (item.datas[monthIndex] || 0),
          0
        ),
      0
    );

    const totalExpenses = this.expenseCategories().reduce(
      (acc, categories) =>
        acc +
        categories.subcategories.reduce(
          (itemAcc, item) => itemAcc + (item.datas[monthIndex] || 0),
          0
        ),
      0
    );

    return totalIncome - totalExpenses;
  }

  getOpeningBalance(monthIndex: number) {
    let balance = 0;
    for (let i = 0; i < monthIndex; i++) {
      balance += this.calculateProfitLoss(i);
    }
    return balance;
  }

  getClosingBalance(monthIndex: number) {
    return (
      this.getOpeningBalance(monthIndex) + this.calculateProfitLoss(monthIndex)
    );
  }

  handleArrowKey(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const type = target.getAttribute('data-type'); // 'income' | 'expense'
    const row = Number(target.getAttribute('data-row'));
    const col = Number(target.getAttribute('data-col'));
    let nextRow = row;
    let nextCol = col;
    switch (event.key) {
      case 'ArrowRight':
        nextCol++;
        break;
      case 'ArrowLeft':
        nextCol--;
        break;
      case 'ArrowDown':
        nextRow++;
        break;
      case 'ArrowUp':
        nextRow--;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextInput = this.findNextInput(type, nextRow, nextCol);
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  }

  findNextInput(type: string | null, row: number, col: number) {
    const inputArray = this.inputs.toArray();
    for (const ref of inputArray) {
      const el = ref.nativeElement;
      if (
        el.getAttribute('data-type') === type &&
        Number(el.getAttribute('data-row')) === row &&
        Number(el.getAttribute('data-col')) === col
      ) {
        return el;
      }
    }
    return null;
  }


  //Apply to all
  onRightClick(event: MouseEvent, rowIndex: number, colIndex: number) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const dataType = target.getAttribute('data-type');
    const value = parseFloat(target.value) || 0;
    
    this.valueToApply.set({
      type: dataType,
      value
    });
    this.contextMenuPosition = { top: event.clientY, left: event.clientX };
    this.selectedRowIndex = rowIndex;
    this.selectedColIndex = colIndex;
    this.isContextMenuVisible = true;
  }
  
  applyToAll() {
    if (this.selectedRowIndex !== null && this.selectedColIndex !== null) {
      const list = this.valueToApply().type === 'income' ? this.incomeCategories() : this.expenseCategories();
      list.forEach(category => {
        category.subcategories.forEach(subcategory => {
          subcategory.datas[this.selectedColIndex] = this.valueToApply().value;
        });
      });
      this.onCloseContextMenu();
    }
  }
  
  onCloseContextMenu() {
    this.isContextMenuVisible = false;
    this.contextMenuPosition = null;
    this.selectedRowIndex = 0; 
    this.selectedColIndex = 0;  
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.context-menu')) {
      this.isContextMenuVisible = false;
    }
  }
  
}
