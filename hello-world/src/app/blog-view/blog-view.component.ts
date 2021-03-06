import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog.service';


@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit {
  public blogId;
  public blog;
  public blogComment:string = '' ;
  constructor( private router : ActivatedRoute,
    private blogService: BlogService) { }

  ngOnInit() {
    this.router.paramMap.subscribe(param => { this.blogId = param.get('id');
  })
  this.getBlogById ()
  }

  getBlogById (){
   this.blogService.getById(this.blogId).subscribe(data => {
     this.blog = data[0]
     console.log(this.blog);
   })
  //  this.blog = this.blogService.getBlogById(this.blogId);
  }

  addComment() {
    if(this.blogComment != '') {
      console.log(this.blogComment);
      this.blogService.addComment(this.blogId,this.blogComment).subscribe(data => {
        console.log(data);
        this.blogComment = '';
        this.getBlogById ();
      });
    }
    // 
  }

}
