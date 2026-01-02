const { exec } = require('child_process');
const assert = require('assert');

describe('create-sipere', function() {
  this.timeout(14000);
  it('create project', (done) => {
    const cmd = './create-sipere.js';
    const child = exec(cmd);
    let output = '';
    child.stdout.on('data', (data) => {
      output += data;
      if(output.includes('Project name?')) {
        child.stdin.write('tesztprojekt\n');
      }
      // if(output.includes('Típus:')) {
      //   child.stdin.write('typescript\n');
      // }
    });

    child.on('close', (code) => {
      assert.ok(output.includes('installing'));
      exec('rm -rf tesztprojekt', () => {});
      done();
    });


  });

});




