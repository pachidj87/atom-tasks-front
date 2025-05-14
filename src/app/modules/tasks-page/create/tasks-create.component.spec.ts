import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCreationPageComponent } from './tasks-creation-page.component';

describe('TasksCreationPageComponent', () => {
  let component: TasksCreationPageComponent;
  let fixture: ComponentFixture<TasksCreationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksCreationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
