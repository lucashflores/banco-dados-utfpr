import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class MiscService {
  mergeTables() {
    let i = 1;
    for (i; i < 13; i++) {
      const fileName = `src/data/infraçoes2021_${i > 9 ? i : '0' + i}.csv`;
      let fileData = fs.readFileSync(fileName, 'utf-8');
      if (i > 1) {
        fileData = fileData.split('\n').slice(1).join('\n');
      }
      fs.appendFileSync('src/data/infracoes.csv', fileData);
      console.log(fileData.length);
    }
    console.log('end!!');
  }
}
