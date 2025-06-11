import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BalanceService } from './balance.service';
import { AccountBalance, UploadResponse } from '../../shared/models/balance.model';

describe('BalanceService', () => {
  let service: BalanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BalanceService]
    });
    service = TestBed.inject(BalanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get latest balances', () => {
    const mockBalances: AccountBalance[] = [
      {
        accountName: 'R&D',
        balance: 1000,
        month: '2024-04-01T00:00:00',
        formattedBalance: 'Rs. 1,000.00/='
      }
    ];

    service.getLatestBalances().subscribe(balances => {
      expect(balances).toEqual(mockBalances);
    });

    const req = httpMock.expectOne('https://localhost:7034/api/Accounts/service/latest-balances');
    expect(req.request.method).toBe('GET');
    req.flush(mockBalances);
  });
});