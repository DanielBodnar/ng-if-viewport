ng-if-viewport
==============

ng-if implementation based off of bootstrap's viewport classes. This directive allows you to specify one of Bootstrap's responsive classes (xs, sm, md, lg, xl) and it will render or prevent rendering of element instead of merely hiding it via a class.

Example
==============
```
<div if-viewport="sm">
  <!-- HTML that will only be rendered if viewport matches sm and above -->
  <div ng-view></div>
</div>
```
