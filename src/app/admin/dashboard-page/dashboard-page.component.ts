import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { PostsService } from '../../shared/posts.service';
import { Post } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts: Post[];
  postsSubscription$: Subscription;
  deleteSubscription$: Subscription;
  searchString = '';

  constructor(
    private authService: AuthService,
    private postsService: PostsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.postsSubscription$ = this.postsService.getAll().subscribe(
      (posts) => {
        this.posts = posts;
      }
    );
  }

  ngOnDestroy() {
    this.postsSubscription$?.unsubscribe();
    this.deleteSubscription$?.unsubscribe();
  }

  removePost(id: string) {
    this.deleteSubscription$ = this.postsService.delete(id).subscribe(
      () => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.alertService.success('Пост был успешно удалён');
      },
      (error) => {
        this.alertService.danger('Пост не был удалён из-за возникшей ошибки');
      }
    );
  }
}
