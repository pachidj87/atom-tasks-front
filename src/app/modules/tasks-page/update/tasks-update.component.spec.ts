import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksUpdatePageComponent } from './tasks-update-page.component';

describe('TasksUpdatePageComponent', () => {
  let component: TasksUpdatePageComponent;
  let fixture: ComponentFixture<TasksUpdatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksUpdatePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksUpdatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
