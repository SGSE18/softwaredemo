import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatTableModule,
  MatInputModule,
  MatOptionModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatInputModule,
    MatOptionModule, MatSelectModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatInputModule,
    MatOptionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class MaterialModule {}
