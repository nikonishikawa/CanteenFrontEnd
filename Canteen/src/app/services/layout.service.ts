import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private activeIndex: number = 0;

  setActiveIndex(index: number | 0) {
    this.activeIndex = index;
  }

  getActiveIndex() {
    return this.activeIndex;
  }
}
