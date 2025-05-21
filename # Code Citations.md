# Code Citations

## License: unknown
https://github.com/hackerman001/InstaClone/tree/c646eebeefe5a645e4595877be3f859c2bbd5389/backend/models/User.js

```
'mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}
```


## License: unknown
https://github.com/Matheus-Rangel/pokehub/tree/485d9fbe71a0ae8005ed04ccaff636b1990ab5ee/backend/models/user.js

```
;

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("
```

