import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';

export class WeekExpense implements IStore {
  expenses = {
    limit: 0,
    today:[0]
  };

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: WeekExpense.name,
      properties: ['expenses'],
    });
  }

  // Unified set methods
  set<T extends StoreKeysOf<WeekExpense>>(what: T, value: WeekExpense[T]) {
    (this as WeekExpense)[what] = value;
  }
  setMany<T extends StoreKeysOf<WeekExpense>>(obj: Record<T, WeekExpense[T]>) {
    for (const [k, v] of Object.entries(obj)) {
      this.set(k as T, v as WeekExpense[T]);
    }
  }
  addExpense(value:number){
    console.log("callme")
    this.expenses.today.push(value)
  }

  removeLastExpense() {
    if (this.expenses.today.length > 1){
      this.expenses.today.pop()
    }
  }
  // Hydration
  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
