import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { ApiService, AssetRent } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-asset-rent',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './asset-rent.component.html',
  styleUrl: './asset-rent.component.scss'
})
export class AssetRentComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'edit',
    'it_asset_id',
    'serialnumber',
    'com_name',
    'com_local_ip',
    'com_join_ip',
    'com_brand',
    'com_model',
    'location',
    'gl_asset_code',
    'com_status'
  ];

  dataSource = new MatTableDataSource<AssetRent>([]);
  private searchSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAssetsRent().subscribe({
      next: (data) => {
        this.dataSource.data = data.assets_rent;
        console.log('Assets loaded:', data);
      },
      error: (err) => console.error('Failed to load assets', err),
    });

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        this.dataSource.filter = term.trim().toLowerCase();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: AssetRent, filter: string) => {
      const searchStr = [
        data.it_asset_id,
        data.serialnumber,
        data.com_name,
        data.com_local_ip,
        data.com_join_ip,
        data.com_brand,
        data.com_model,
        data.location,
        data.gl_asset_code,
        data.com_status
      ].filter(v => v != null).join('|').toLowerCase();

      return searchStr.includes(filter);
    };
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  onEdit(asset: AssetRent): void {
    this.router.navigate(['/update-assets-rent'], { state: { it_asset_id: asset.it_asset_id } });
  }
}
