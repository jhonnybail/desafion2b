import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { AppModule } from '../app.module';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ListPostComponent } from './list-post.component';
import { environment } from '../../environments/environment';
import { DebugElement } from '@angular/core';

describe('ListPostComponent', () => {
  let component: ListPostComponent;
  let fixture: ComponentFixture<ListPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load posts', fakeAsync(
    inject(
      [HttpTestingController],
      (backend: HttpTestingController) => {
        const debugElement: DebugElement = fixture.debugElement;

        const data = {
          success: true,
          data: {
            total: 1,
            results: [{
              id: 1,
              titulo: 'Teste',
              texto: 'Testando'
            }]
          }
        };

        const requestWrapper = backend.expectOne({url: `${environment.apiURL}post`});
        requestWrapper.flush(data);

        tick();

        component.load();
        
        const requestWrapper2 = backend.expectOne({url: `${environment.apiURL}post`});
        requestWrapper2.flush(data);

        tick();

        fixture.detectChanges();
        
        expect(debugElement.nativeElement.querySelectorAll('div.card').length).toEqual(1);
        expect(debugElement.nativeElement.querySelector('div.card').querySelector('h5.card-title').innerText).toEqual(data.data.results[0].titulo);

      }
    )
  ));

});
