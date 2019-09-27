import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { AuthService } from '../services/AuthService';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.scss']
})
export class ListPostComponent implements OnInit {

  posts: Object[];
  title: string = 'Últimos Posts';
  authorAuthenticated: Object = null;
  isLoading: boolean = false;
  editArea: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private toastrService: ToastrService, private modalService: NgbModal) {
    this.authorAuthenticated = authService.getUser();
  }

  load() {
    let url   = `${environment.apiURL}post`;
    if(this.router.url === '/meus-posts' && this.authorAuthenticated){
      url   += '?idAutor=' + this.authService.getUser().id;
    }
    this.isLoading = true;
    this.http.get(url)
      .subscribe(data => {
        this.isLoading = false;
        this.posts = data['data'].results;
      }, ({ error }) => {
        this.toastrService.error(error.message);
        this.isLoading = false;
      });
  }

  remove(post) {
    post.disabled = true;
    this.http.delete(`${environment.apiURL}post/${post.id}`)
      .subscribe(data => {
        this.posts.splice(this.posts.indexOf(post), 1);
        post.disabled = false;
      }, ({ error }) => {
        this.toastrService.error("Não foi possível remover o post, tente mais tarde.");
        post.disabled = false;
      });
  }

  add () {
    const modalRef = this.modalService.open(EditPostComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.result
      .then(data => this.toastrService.success('Post publicado com sucesso!'))
      .then(() => this.load())
      .catch(() => {});
  }

  edit (post) {
    const modalRef = this.modalService.open(EditPostComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.post = post;
    modalRef.result
      .then( data => this.posts[this.posts.indexOf(post)] = {...post, ...data})
      .then(() => this.toastrService.success('Post salvo com sucesso!'))
      .catch(() => {});
  }

  ngOnInit() {
    this.editArea = false;
    if(this.router.url === '/meus-posts' && this.authorAuthenticated){
      this.title    = 'Meus Posts';
      this.editArea = true;
    }
    this.load();
  }

}
