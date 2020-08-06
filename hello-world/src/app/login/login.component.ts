import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public uname:string = '';
  public password:string = '';
  public role:string = '';

  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if ( this.uname && this.password != '' ){
      this.blogService.userLogin(this.uname,this.password).subscribe(data => {
        if(data != null ) {
          this.router.navigateByUrl('/blog');
        } else {
          console.log('login failed');
        }
      })
    }
  }
}
