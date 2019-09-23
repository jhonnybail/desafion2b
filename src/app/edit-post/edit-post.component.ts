import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit, OnChanges {

  private _post: Object = {};

  addPost: FormGroup;
  loading: boolean = false;
  capa: any;
  

  @Input()
  set post(post) {
    if(post && post['capa']){
      this.capa = {
        url: post['capa']
      }
    }
    this._post = post;
  }

  get post() {
    return this._post;
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient, public activeModal: NgbActiveModal, private toastrService: ToastrService, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    const post: SimpleChange = changes.post;
    if(post && post['capa']){
      this.capa = {
        url: post['capa']
      }
    }
  }

  ngOnInit() {
    this.addPost = this.formBuilder.group({
      id: [this.post['id']],
      titulo: [this.post['titulo'], Validators.required],
      texto: [this.post['texto'], Validators.required],
      capa: [null]
    });
  }

  selectFile(files) {
    this.capa = files.length > 0 ? {
      file: files[0],
      url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files[0]))
    } : null;
  }

  async onSubmit() {
    this.loading = true;
    let http;
    let {id, capa, ...values} = this.addPost.value;

    //Send image
    if(this.capa && this.capa.file){
      let data:FormData = new FormData();
      data.append('upload_preset', environment.cloudinary.unsafePresetsName);
      data.append('file', this.capa.file, this.capa.file.name);
      let result  = await this.http.post(`https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`, data).toPromise();
      values.capa = result['secure_url'];
    }
    //

    if(this.post['id'])
      http = this.http.put(`${environment.apiURL}post/${id}`, values);
    else
      http = this.http.post(`${environment.apiURL}post`, values);

    http
      .subscribe(
        data  => {
          this.activeModal.close(data.data);
          this.loading = false;
        },
        ({ error }) => {
          this.toastrService.error(error.message);
          this.loading = false;
        });
  }

}
