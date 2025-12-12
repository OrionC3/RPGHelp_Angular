import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '@core/services/loading-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  imports: [AsyncPipe],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  isLoading$!: Observable<boolean>;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.isLoading$ = this.loadingService.isLoading$;
  }
}