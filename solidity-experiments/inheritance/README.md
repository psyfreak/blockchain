# Inheriance

if ctor of base contract has no paramemters the standard ctor will be just called, when child contract is executed
if ctor of base contract has parameters you nned to call the ctor either:
a. directly in "is" directive or
b. you need to call the ctor after ctor header


see https://www.bitdegree.org/learn/solidity-inheritance


Tip: choose the first method when the constructor argument is a constant and defines or describes the way contract works. Use the second when the base arguments rely on one of the derived contracts.

