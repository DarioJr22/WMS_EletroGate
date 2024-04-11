import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenciaComponent } from './conferencia.component';

describe('ConferenciaComponent', () => {
  let component: ConferenciaComponent;
  let fixture: ComponentFixture<ConferenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConferenciaComponent]
    });
    fixture = TestBed.createComponent(ConferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
