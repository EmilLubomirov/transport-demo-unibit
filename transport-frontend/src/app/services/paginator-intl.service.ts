import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class BgPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Записи на страница:';
  override nextPageLabel = 'Следваща страница';
  override previousPageLabel = 'Предишна страница';
  override firstPageLabel = 'Първа страница';
  override lastPageLabel = 'Последна страница';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) return '0 от 0';
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} – ${end} от ${length}`;
  };
}
