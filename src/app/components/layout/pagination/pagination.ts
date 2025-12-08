import { Component, computed, input, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-pagination',
    imports: [TranslatePipe],
    templateUrl: './pagination.html',
    styleUrl: './pagination.scss',
})
export class Pagination {
    total = input.required<number | null>();
    currentPage = model<number>(1);
    futurPage = output<number>();
    pageSize = input<number>(10);

    maxPages = computed(() => {
        const totalCount = this.total();
        if (totalCount === null || totalCount <= 0) {
            return 0;
        }
        const maxIndex = Math.ceil(totalCount / this.pageSize());
        return maxIndex;
    });

    updateCurrentPage(amount: number): void {
        this.currentPage.update((currentCount) => currentCount + amount);
    }

    setCurrentPage(value: number): void {
        this.currentPage.update((currentAmount) => (currentAmount = value));
    }

    onClickNext() {
        this.updateCurrentPage(+1);
        this.futurPage.emit(this.currentPage());
    }

    onClickPrevious() {
        this.updateCurrentPage(-1);
        this.futurPage.emit(this.currentPage());
    }

    onFirstPage() {
        this.setCurrentPage(1);
        this.futurPage.emit(1);
    }

    onLastPage() {
        this.setCurrentPage(this.maxPages());
        this.futurPage.emit(this.maxPages());
    }
}
