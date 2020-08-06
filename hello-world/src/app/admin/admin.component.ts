import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public name:string = '';
  public email :string = '';
  public password:string = '';
  public role:string = '';
  public status:boolean = true;
  public userData = {};
  constructor(
    private blogService: BlogService,
    private router: Router,
  ) { }
  blogs = [];

  ngOnInit(): void {
    this.getData()
  }
  getData () {
      return this.userData = {
      name :this.name,
      email : this.email,
      password : this.password,
      role : this.role,
      status : this.status
   }
  }
  
  addUser(){
    if(this.getData != null) {
      this.blogService.addUser(this.getData()).subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/users');

      })
    }
  }
}
