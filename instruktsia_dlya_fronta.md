План разработки пагинации на фронтенде

    1. Изменения в API

    URL: https://api.solowaystudio.ru/api/recordings

    Новые параметры запроса:


    ┌──────────┬─────────┬──────────────┬───────────────────────────────────────┐
    │ Параметр │ Тип     │ По умолчанию │ Описание                              │
    ├──────────┼─────────┼──────────────┼───────────────────────────────────────┤
    │ page     │ integer │ 1            │ Номер страницы                        │
    │ per_page │ integer │ 50           │ Записей на странице (макс. 100)       │
    │ sort     │ string  │ "date"       │ Поле сортировки: date, name, size     │
    │ order    │ string  │ "desc"       │ Порядок: asc, desc                    │
    │ date     │ string  │ null         │ Фильтр по дате: YYYY-MM-DD            │
    │ stream   │ string  │ null         │ Фильтр по потоку: mystream, mystream2 │
    └──────────┴─────────┴──────────────┴───────────────────────────────────────┘


    Примеры запросов:

      1 // Первая страница, 20 записей
      2 GET /api/recordings?page=1&per_page=20
      3 
      4 // Вторая страница с фильтром по потоку
      5 GET /api/recordings?page=2&per_page=20&stream=mystream
      6 
      7 // Сортировка по размеру (возрастание)
      8 GET /api/recordings?sort=size&order=asc
      9 
     10 // Фильтр по дате
     11 GET /api/recordings?date=2026-03-26&per_page=50

    ---

    2. Новая структура ответа

    Было:

     1 {
     2   "recordings": [...]
     3 }

    Стало:

      1 {
      2   "data": [
      3     {
      4       "name": "2026-03-26_18-53-35.mp4",
      5       "path": "/recordings/mystream/2026-03-26_18-53-35.mp4",
      6       "rel_path": "mystream/2026-03-26_18-53-35.mp4",
      7       "size": 22401910,
      8       "date": "2026-03-26",
      9       "time": "18:53:35",
     10       "mtime": 1774551515,
     11       "age": 376
     12     }
     13     // ... ещё записи
     14   ],
     15   "pagination": {
     16     "page": 1,
     17     "per_page": 20,
     18     "total_items": 460,
     19     "total_pages": 23,
     20     "has_next": true,
     21     "has_prev": false,
     22     "next_page": 2,
     23     "prev_page": null
     24   },
     25   "filters": {
     26     "date": null,
     27     "stream": null
     28   },
     29   "sort": {
     30     "by": "date",
     31     "order": "desc"
     32   }
     33 }

    ---

    3. Задачи для фронтенд-разработки

    3.1. Обновить сервис API

      1 // recordings.service.ts
      2 interface PaginationParams {
      3   page?: number;
      4   per_page?: number;
      5   sort?: 'date' | 'name' | 'size';
      6   order?: 'asc' | 'desc';
      7   date?: string;
      8   stream?: string;
      9 }
     10 
     11 interface PaginationMeta {
     12   page: number;
     13   per_page: number;
     14   total_items: number;
     15   total_pages: number;
     16   has_next: boolean;
     17   has_prev: boolean;
     18   next_page: number | null;
     19   prev_page: number | null;
     20 }
     21 
     22 interface RecordingsResponse {
     23   data: Recording[];
     24   pagination: PaginationMeta;
     25   filters: { date: string | null; stream: string | null };
     26   sort: { by: string; order: string };
     27 }
     28 
     29 getRecordings(params: PaginationParams = {}): Observable<RecordingsResponse> {
     30   return this.http.get<RecordingsResponse>('/api/recordings', { params });
     31 }

    3.2. Компонент пагинации

      1 // pagination.component.ts
      2 @Component({
      3   selector: 'app-pagination',
      4   template: `
      5     <div class="pagination">
      6       <button 
      7         [disabled]="!meta.has_prev"
      8         (click)="onPageChange(meta.prev_page)">
      9         ← Пред.
     10       </button>
     11       
     12       <span class="page-info">
     13         Страница {{ meta.page }} из {{ meta.total_pages }}
     14         ({{ meta.total_items }} записей)
     15       </span>
     16       
     17       <button 
     18         [disabled]="!meta.has_next"
     19         (click)="onPageChange(meta.next_page)">
     20         След. →
     21       </button>
     22     </div>
     23   `
     24 })
     25 export class PaginationComponent {
     26   @Input() meta: PaginationMeta;
     27   @Output() pageChanged = new EventEmitter<number>();
     28   
     29   onPageChange(page: number) {
     30     this.pageChanged.emit(page);
     31   }
     32 }

    3.3. Обновить компонент списка записей

      1 // recordings.component.ts
      2 @Component({
      3   selector: 'app-recordings',
      4   template: `
      5     <div class="filters">
      6       <select [(ngModel)]="filters.stream" (change)="applyFilters()">
      7         <option value="">Все потоки</option>
      8         <option value="mystream">Камера</option>
      9         <option value="mystream2">Камера 2</option>
     10       </select>
     11       
     12       <input type="date" [(ngModel)]="filters.date" (change)="applyFilters()">
     13       
     14       <select [(ngModel)]="sortBy" (change)="applyFilters()">
     15         <option value="date">По дате</option>
     16         <option value="name">По имени</option>
     17         <option value="size">По размеру</option>
     18       </select>
     19     </div>
     20     
     21     <ul class="recordings-list">
     22       <li *ngFor="let rec of recordings">
     23         {{ rec.name }} ({{ rec.date }} {{ rec.time }})
     24       </li>
     25     </ul>
     26     
     27     <app-pagination 
     28       [meta]="paginationMeta"
     29       (pageChanged)="onPageChange($event)">
     30     </app-pagination>
     31   `
     32 })
     33 export class RecordingsComponent {
     34   recordings: Recording[] = [];
     35   paginationMeta: PaginationMeta;
     36   currentPage = 1;
     37   perPage = 20;
     38   filters = { stream: '', date: '' };
     39   sortBy = 'date';
     40   
     41   loadRecordings() {
     42     this.recordingsService.getRecordings({
     43       page: this.currentPage,
     44       per_page: this.perPage,
     45       sort: this.sortBy,
     46       order: 'desc',
     47       stream: this.filters.stream || undefined,
     48       date: this.filters.date || undefined
     49     }).subscribe(response => {
     50       this.recordings = response.data;
     51       this.paginationMeta = response.pagination;
     52     });
     53   }
     54   
     55   onPageChange(page: number) {
     56     this.currentPage = page;
     57     this.loadRecordings();
     58     window.scrollTo({ top: 0, behavior: 'smooth' });
     59   }
     60   
     61   applyFilters() {
     62     this.currentPage = 1;
     63     this.loadRecordings();
     64   }
     65 }

    ---

    4. Чек-лист для разработки

     - [ ] Обновить сервис API для работы с новой структурой ответа
     - [ ] Создать компонент пагинации (кнопки "Пред./След.", инфо о страницах)
     - [ ] Добавить фильтры (поток, дата)
     - [ ] Добавить сортировку (по дате, имени, размеру)
     - [ ] Обработать состояния загрузки и ошибок
     - [ ] Добавить скролл к началу списка при смене страницы
     - [ ] Протестировать на мобильных устройствах
     - [ ] Протестировать с большим количеством записей (1000+)

    ---

    5. API Endpoints (сводно)


    ┌───────┬─────────────────────────────────────┬────────────────────────────┐
    │ Метод │ URL                                 │ Описание                   │
    ├───────┼─────────────────────────────────────┼────────────────────────────┤
    │ GET   │ /api/recordings                     │ Список с пагинацией        │
    │ GET   │ /api/recordings?page=2              │ Страница 2                 │
    │ GET   │ /api/recordings?stream=mystream     │ Фильтр по потоку           │
    │ GET   │ /api/recordings?date=2026-03-26     │ Фильтр по дате             │
    │ GET   │ /api/recordings?sort=size&order=asc │ Сортировка                 │
    │ GET   │ /recordings/{rel_path}              │ Скачать/воспроизвести файл │
    └───────┴─────────────────────────────────────┴────────────────────────────┘


    ---

    6. Примечания

     1. Фильтр незавершённых записей — файлы моложе 2 минут автоматически исключаются из ответа
     2. Кэширование — рекомендуется кэшировать ответы на стороне клиента
     3. Производительность — при 1000+ записях пагинация критически важна
     4. Сортировка по умолчанию — новые записи первыми (sort=date&order=desc)

    ---


