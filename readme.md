# Express 
## Routing 
- .use('url', (req, res) => { handle/task  res.json({})}) (CRUD)
    * To receive aany request 
- .get('url', (req, res) => { handle/task  res.json({})})(Read operation)
    * To accept only get Request
- .post('url', (req, res) => { handle/task  res.json({})})(Create Operation)
    * To accept only post Request
- .put('url', (req, res) => { handle/task  res.json({})})(Update Operation)
    * To accept only put Request
- .patch('url', (req, res) => { handle/task  res.json({})})(Update Operation)
    * To accept only patch Request
- .delete('url', (req, res) => { handle/task  res.json({})})(Delete Operation)
    * To accept only delete Request
        



### Project Architecture 
- Folder Architecture 

    Modular 
        /src 
            /auth
                ... mvc 
            /category
                ..mvc

    OR  
        /src
            /controller 
            /model 
            /view 
            /services 
            /middleware




