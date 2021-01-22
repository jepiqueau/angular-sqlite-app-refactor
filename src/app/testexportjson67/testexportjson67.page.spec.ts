import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Testexportjson67Page } from './testexportjson67.page';

describe('Testexportjson67Page', () => {
  let component: Testexportjson67Page;
  let fixture: ComponentFixture<Testexportjson67Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Testexportjson67Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Testexportjson67Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
