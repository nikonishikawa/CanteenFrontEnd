import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMenuComponent } from './manage-menu.component';

describe('manage-menu.component', () => {
  let component: ManageMenuComponent;
  let fixture: ComponentFixture<ManageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
