import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

interface LoginParams {
  loginAgain?: boolean;
  authFailed?: boolean;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  message: string;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params & LoginParams) => {
      if (params.loginAgain) {
        this.message = 'Пожалуйста, войдите в учётную запись!';
      } else if (params.authFailed) {
        this.message = 'Сессия истекла, пожалуйста, войдите заново!';
      }
    });

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.required
      ])
    });
  }

  submit() {
    console.log(this.form);
    this.submitted = true;

    if (this.form.invalid) {
      return ;
    }

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.login(user)
      .subscribe(
        () => {
          this.form.reset();
          this.router.navigate(['/admin', 'dashboard']);
        },
        (error) => {
          this.submitted = false;
        }
      );
  }
}
