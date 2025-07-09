import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PersoaneModalComponent } from './Persoane-modal/Persoane-modal.component';

interface Persoana {
  id: number;
  nume: string;
  prenume: string;
  cnp: string;
  varsta: number;
  masini: any[];
}

@Component({
  selector: 'app-persoane',
  templateUrl: './Persoane.component.html',
})
export class PersoaneComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;

  limit: number = 70;
  showBackTop: string = '';
  persoane: Persoana[] = [];
  filterNumePrenume: string = '';
  filterCnp: string = '';
  filterVarsta: string = '';
  filterMasini: string = '';

  constructor(
    private _modal: NgbModal,
    private _spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this._spinner.show();
    axios
      .get<Persoana[]>('/api/persoana')
      .then(({ data }) => {
        this.persoane = data;
        this._spinner.hide();
      })
      .catch(() => {
        this._spinner.hide();
        this.toastr.error('Eroare la preluarea persoanelor!');
      });
  }

  addEdit(id_persoana?: number): void {
    const modalRef = this._modal.open(PersoaneModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_persoana = id_persoana;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete(persoana: Persoana): void {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.title = `Ștergere persoană`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana <b>${persoana.nume} ${persoana.prenume}</b>?</p>`;
    modalRef.closed.subscribe(() => {
      axios
        .delete(`/api/persoana/${persoana.id}`)
        .then(() => {
          this.toastr.success('Persoana a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => this.toastr.error('Eroare la ștergerea persoanei!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    const scrollTop = document.getElementsByClassName('view-scroll-persoane')[0]
      .scrollTop;
    this.showBackTop = scrollTop > 500 ? 'show' : '';
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-persoane', 0);
    this.limit = 70;
  }

  get persoaneFiltrate() {
    return this.persoane.filter((p) => {
      const numePrenume = (p.nume + ' ' + p.prenume).toLowerCase();
      const cnp = p.cnp.toLowerCase();
      const varsta = String(p.varsta);
      const masini = (p.masini || [])
        .map((m) => `${m?.marca || ''} ${m?.model || ''}`)
        .join(' ')
        .toLowerCase();

      return (
        numePrenume.includes(this.filterNumePrenume.toLowerCase()) &&
        cnp.includes(this.filterCnp.toLowerCase()) &&
        varsta.includes(this.filterVarsta) &&
        masini.includes(this.filterMasini.toLowerCase())
      );
    });
  }
}
