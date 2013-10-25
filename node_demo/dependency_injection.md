## Dependency Injection and Compiled vs. Interpreted Languages

Dependency injection is: giving an object its instance variables instead of having the object construct those variables itself.

No dependency injection:

```ruby

class SmallTown
	def initialize
		@ruler = Ruler.new
	end
end
```

Dependency injection:

```ruby

class SmallTown
	def initialize(ruler)
		@ruler = ruler
	end
end
```

More dependency injection lets us unit-test things: we can now make a mock of a ruler (`double("Ruler")`) to pass into SmallTown's initialize method when we test.  Otherwise, we would have to mess around with the `Ruler#initialize` method.

In compiled languages (languages that translate code into machine language before they run): with dependency injection, objects are given their dependencies at run time (when the code "runs") rather than compile time (when the code is turned into machine language).  

Ruby and Javascript are interpreted languages, which translate into machine code on-the-fly.

Could be a good interview question.