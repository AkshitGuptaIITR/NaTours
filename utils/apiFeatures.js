// * Creating the class for with the methods that help us to re use the code again

class APIfeatures {
  // * Constructor functions run just as soon as the class method is created
  constructor(query, queryString) {
    this.query = query;             // * Creating query variable in the class
    this.queryString = queryString  // * Creating the queryString variable in the class
  }

  filter() {
    // * Here The filtering logic is also applied
    const queryQbj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryQbj[el]);

    let queryStr = JSON.stringify(queryQbj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr))
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(" ");
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIfeatures;