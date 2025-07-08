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
import { MasiniModalComponent } from './Masini-modal/Masini-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface Masina {
  id: number;
  marca: string;
  model: string;
  an_fabricatie: number;
  capacitate_cilindrica: number;
  taxa_impozit: number;
}

@Component({
  selector: 'app-masini',
  templateUrl: './Masini.component.html',
  styleUrls: ['./Masini.component.scss'],
})
export class MasiniComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  masini: Masina[] = [];
  limit: number = 70;
  showBackTop: string = '';

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

  loadData = (): void => {
    this._spinner.show();
    axios
      .get('/api/masina')
      .then(({ data }) => {
        this.masini = data;
        this._spinner.hide();
      })
      .catch(() => this.toastr.error('Eroare la preluarea mașinilor!'));
  };

  addEdit = (id_masina?: number): void => {
    const modalRef = this._modal.open(MasiniModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_masina = id_masina;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  };

  delete = (masina: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.title = `Ștergere mașină`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți mașina <b>${masina.marca} ${masina.model}</b>?</p>`;
    modalRef.closed.subscribe(() => {
      axios
        .delete(`/api/masina/${masina.id}`)
        .then(() => {
          this.toastr.success('Mașina a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => this.toastr.error('Eroare la ștergerea mașinii!'));
    });
  };

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (
      document.getElementsByClassName('view-scroll-masini')[0].scrollTop > 500
    ) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-masini', 0);
    this.limit = 70;
  }

  filterMarca: string = '';
  filterModel: string = '';
  filterAn: string = '';
  filterCc: string = '';
  filterTaxa: string = '';

  get masiniFiltrate() {
    return this.masini.filter((m: Masina) => {
      const marca = m.marca.toLowerCase();
      const model = m.model.toLowerCase();
      const an = String(m.an_fabricatie);
      const cc = String(m.capacitate_cilindrica);
      const taxa = String(m.taxa_impozit);

      return (
        marca.includes(this.filterMarca.toLowerCase()) &&
        model.includes(this.filterModel.toLowerCase()) &&
        an.includes(this.filterAn) &&
        cc.includes(this.filterCc) &&
        taxa.includes(this.filterTaxa)
      );
    });
  }
}
