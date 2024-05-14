import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFoodCategoryComponent } from './manage-food-category.component';

describe('ManageFoodCategoryComponent', () => {
  let component: ManageFoodCategoryComponent;
  let fixture: ComponentFixture<ManageFoodCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFoodCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageFoodCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
