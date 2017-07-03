/**
 * Created by Etudiant on 03/07/2017.
 */
var i = 10;

function test()
{
    if(i != 0)
    {
        i--;
        console.log(i);
    }
    else
    {
        return false;
    }
    test();
}


test();