import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {
  public title:string = '';
  public content:string = '';
  public author:string = '';
  public featuredImage:string = '';
  constructor(
    private blogService: BlogService,
    private router: Router,
    // private route: Route
  ) { }
  blogs = [];

  ngOnInit() {

  }
  uploadImage(event){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        let url = event.target.result;
        console.log(url);
      }
    }
  }
  addBlog(){
    if(this.title && this.content && this.author && this.featuredImage != '') {
      this.blogService.addBlog(this.title,this.content,this.author,this.featuredImage).subscribe(data => {
        this.router.navigateByUrl('');
      })
    }
  }
}
