import { TestBed } from '@angular/core/testing';
import { CredentialsInterceptor } from './credentials.interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('CredentialsInterceptor', () => {
  let credentialsInterceptor: CredentialsInterceptor;
  let httpMock: HttpTestingController;
  let mockHandler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CredentialsInterceptor],
    });

    credentialsInterceptor = TestBed.inject(CredentialsInterceptor);
    httpMock = TestBed.inject(HttpTestingController);

    mockHandler = {
      handle: (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
        return new Observable<HttpEvent<unknown>>();
      },
    };
  });

  xit('should add the api-key header and withCredentials flag to the request', () => {
    const dummyRequest = new HttpRequest('GET', environment.baseUrl);
    const apiKeyHeaderValue = environment.apiKey;

    credentialsInterceptor.intercept(dummyRequest, mockHandler).subscribe();

    const interceptedRequest = httpMock.expectOne(environment.baseUrl);
    expect(interceptedRequest.request.headers.get('api-key')).toBe(
      apiKeyHeaderValue
    );
    expect(interceptedRequest.request.withCredentials).toBeTrue();

    interceptedRequest.flush({});
  });
});
