/* copy this in online Java compiler https://www.onlinegdb.com/online_java_compiler */

public class Main
{
	public static void main(String[] args) {
		System.out.println(Math.nextUp(1));
		System.out.println(Math.nextUp(123e120));
		System.out.println(Math.nextUp(-1));
		System.out.println(Math.nextUp(0));
		System.out.println(Math.nextUp(Infinity));
		System.out.println(Math.nextUp(-Infinity));
		System.out.println(Math.nextUp(1.7976931348623157E308));
		System.out.println(Math.nextUp(2e-300));
		System.out.println(Math.nextUp(2.1341341234e-310));
		System.out.println(Math.nextUp(4.322345837456233E100));
		System.out.println(Math.nextUp(4.322345837456234E-100));
	}
}