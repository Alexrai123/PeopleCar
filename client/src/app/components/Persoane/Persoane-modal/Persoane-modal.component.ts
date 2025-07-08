import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-persoane-modal',
  templateUrl: './Persoane-modal.component.html',
})
export class PersoaneModalComponent implements OnInit {
  @Input() id_persoana: number | undefined;

  modal = {} as any;
  listaMasini: any[] = [];
  constructor(
    private _spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadMasini();

    if (this.id_persoana) {
      this._spinner.show();
      axios
        .get(`/api/persoana/${this.id_persoana}`)
        .then(({ data }) => {
          this.modal = data;
          // extrage doar ID-urile mașinilor pentru ng-select
          this.modal.masini = (data.masini || []).map((m: any) => m.id);
          this._spinner.hide();
        })
        .catch(() => {
          this._spinner.hide();
          this.toastr.error('Eroare la preluarea persoanei!');
        });
    }
  }

  loadMasini(): void {
    this._spinner.show();
    axios
      .get('/api/masina')
      .then(({ data }) => {
        this.listaMasini = data.map((m: any) => ({
          ...m,
          denumire: `${m.marca} ${m.model}`.trim(),
        }));
        this._spinner.hide();
      })
      .catch(() => {
        this.toastr.error('Eroare la încărcarea mașinilor!');
        this._spinner.hide();
      });
  }

  save(): void {
    this._spinner.show();

    this.calculeazaVarsta();

    const request = this.id_persoana
      ? axios.put('/api/persoana', this.modal)
      : axios.post('/api/persoana', this.modal);

    request
      .then(() => {
        this._spinner.hide();
        this.toastr.success(
          `Persoana a fost ${
            this.id_persoana ? 'modificată' : 'adăugată'
          } cu succes!`
        );
        this.activeModal.close();
      })
      .catch(() => {
        this._spinner.hide();
        this.toastr.error('Eroare la salvarea persoanei!');
      });
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter((t) => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach((term) =>
      isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1)
    );
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }

  calculeazaVarsta(): void {
    if (!this.modal.cnp || this.modal.cnp.length < 7) return;

    const sex = this.modal.cnp[0];
    const an = parseInt(this.modal.cnp.slice(1, 3), 10);
    const luna = parseInt(this.modal.cnp.slice(3, 5), 10) - 1;
    const zi = parseInt(this.modal.cnp.slice(5, 7), 10);

    const anComplet = sex === '1' || sex === '2' ? 1900 + an : 2000 + an;
    const dataNastere = new Date(anComplet, luna, zi);

    const azi = new Date();
    let varsta = azi.getFullYear() - dataNastere.getFullYear();
    if (
      azi.getMonth() < dataNastere.getMonth() ||
      (azi.getMonth() === dataNastere.getMonth() &&
        azi.getDate() < dataNastere.getDate())
    ) {
      varsta--;
    }

    this.modal.varsta = varsta;
  }
}
