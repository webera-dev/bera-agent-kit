import { expect } from 'chai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Make chai available globally
declare global {
  var expect: Chai.ExpectStatic;
}
global.expect = expect;
