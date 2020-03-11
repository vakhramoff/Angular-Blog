import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FbCreateResponse, Post } from './interfaces';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(
    private http: HttpClient
  ) { }

  create(post: Post): Observable<Post> {
    // @ts-ignore
    return this.http.post<Post>(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse & Post): Post => {
          return { ...post, id: response.name, date: new Date(post.date) };
        })
      );
  }

  getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(
        // tap((data) => console.log(data)),
        map(
          (response: { [key: string]: any }) => {
            return Object
              .keys(response)
              .map((key) => ({
                ...response[key],
                id: key,
                date: new Date(response[key].date)
              }));
          }
        )
      );
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => ({ ...post, id, date: new Date(post.date) }))
      );
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }
}
