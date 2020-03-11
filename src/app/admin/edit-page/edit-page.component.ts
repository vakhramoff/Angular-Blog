import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../../shared/posts.service';
import { Post } from '../../shared/interfaces';
import { switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  post: Post;
  form: FormGroup;
  submitted = false;
  updateSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postsService.getById(params.id);
        })
      )
      .subscribe(
        (post: Post) => {
          this.post = post;
          this.form = new FormGroup({
            title: new FormControl(post.title, Validators.required),
            text: new FormControl(post.text, Validators.required)
          });
        },
        (error) => {
          this.alertService.danger('Ошибка загрузки поста');
        }
      );
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     console.log(params);
    //     this.postsService.getById(params.id)
    //       .subscribe(
    //         (post) => {
    //           this.post = post;
    //         },
    //         (error) => {
    //           console.warn('Error while getting post', post);
    //         }
    //       );
    //   }
    // );
  }

  submit() {
    if (this.form.invalid) {
      return ;
    }

    const postToUpdate = {
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    };

    this.submitted = true;

    this.postsService
      .update(postToUpdate)
      .subscribe(
        () => {
          this.submitted = false;
          this.alertService.success('Пост отредактирован');
        },
        (error) => {
          this.alertService.danger('Ошибка редактирования поста');
        },
        () => {
          this.submitted = false;
        }
        );
  }

  ngOnDestroy(): void {
    this.updateSubscription$?.unsubscribe();
  }
}
